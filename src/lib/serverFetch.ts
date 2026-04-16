import * as AuthSession from "@/services/auth/session";
import * as AuthService from "@/services/auth/service";
import { redirect } from "next/navigation";

/**
 * PRODUCTION-GRADE TRANSPORT LAYER (v10.0)
 * Handles:
 * 1. Token Refresh Coordination (Prevents refresh stampede)
 * 2. Transparent 401 Retries
 * 3. Automatic Timeout (8s)
 * 4. Fail-Hard Redirection (Forced logout on refresh failure)
 */

const BACKEND_API_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

type ServerFetchOptions = RequestInit & {
    idempotencyKey?: string;
    timeout?: number;
};

// Singleton promise to coordinate parallel refresh attempts across a single request context
let refreshPromise: Promise<string | null> | null = null;

/**
 * Orchestrates token retrieval and refresh coordination.
 * Single source of truth for the token refresh lifecycle.
 */
async function getValidAccessToken(options: { forceRefresh?: boolean } = {}): Promise<string | null> {
    const { forceRefresh = false } = options;

    // 1. Proactive expiry check (optimization hint)
    if (!forceRefresh) {
        const accessToken = await AuthSession.getAccessToken();
        if (accessToken) return accessToken;
    }

    const refreshToken = await AuthSession.getRefreshToken();
    if (!refreshToken) return null;

    // 2. Prevent refresh stampede: If a refresh is already in progress, wait for it.
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const result = await AuthService.refreshAccessToken(refreshToken);
            
            if (!result.success) {
                console.error({
                    event: "AUTH_REFRESH",
                    status: "FAIL",
                    timestamp: new Date().toISOString(),
                });
                return null;
            }

            console.log({
                event: "AUTH_REFRESH",
                status: "SUCCESS",
                timestamp: new Date().toISOString(),
            });

            // Update session with NEW tokens (Access + potentially Rotated Refresh)
            await AuthSession.setAuthTokens(result.data);
            return result.data.accessToken;
        })();

        refreshPromise.finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

/**
 * The core transport engine with retry and fail-hard logic.
 */
const serverFetchHelper = async (endpoint: string, options: ServerFetchOptions): Promise<Response> => {
    const { headers, idempotencyKey, timeout = 8000, ...restOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const makeRequest = async (token: string | null) => {
        // Enforce Authorization Authority: Strict header merging
        const finalHeaders: Record<string, string> = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        // Apply caller-provided headers
        if (headers) {
            Object.assign(finalHeaders, headers);
        }

        // Apply idempotency key for mutation safety
        if (idempotencyKey) {
            finalHeaders["x-idempotency-key"] = idempotencyKey;
        }

        // Apply Authorization LAST: This ensures it cannot be overridden by 'headers'
        if (token) {
            finalHeaders["Authorization"] = `Bearer ${token}`;
        }

        return fetch(`${BACKEND_API_URL}${endpoint}`, {
            ...restOptions,
            signal: controller.signal,
            headers: finalHeaders,
        });
    };

    try {
        let token = await getValidAccessToken();
        let response = await makeRequest(token);

        // ─── 401 RETRY LOGIC (UNIFIED) ───
        if (response.status === 401) {
            console.warn("[SERVER_FETCH]: Received 401. Triggering unified refresh path...");
            
            // Re-fetch token through the single source of truth (forcing a refresh)
            const retryToken = await getValidAccessToken({ forceRefresh: true });

            if (!retryToken) {
                console.error("[SERVER_FETCH]: Refresh path failed during 401 retry. Forcing logout.");
                await AuthSession.clearAuthTokens();
                redirect("/login");
            }

            // Retry the original request with the fresh token
            response = await makeRequest(retryToken);

            // SECOND FAILURE -> COMPROMISED SESSION -> TERMINATE
            if (response.status === 401) {
                console.error("[SERVER_FETCH]: 401 persisted after successful refresh call. Terminating session.");
                await AuthSession.clearAuthTokens();
                redirect("/login");
            }
        }

        return response;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error({
                event: "TRANSPORT_TIMEOUT",
                endpoint,
                timeout,
                timestamp: new Date().toISOString(),
            });
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

/**
 * Public ServerFetch API.
 * Maps standard HTTP methods to the smart transport engine.
 */
export const serverFetch = {
    get: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
