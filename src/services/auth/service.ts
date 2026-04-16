import { parse } from "cookie";
import { TLoginInput, TRegisterInput } from "./auth.validation";
import { TAuthResult } from "./auth.types";

/**
 * Service Layer: External System Boundary (API).
 * Handles raw API calls and normalizes responses.
 * Rules: No Next.js leakage (headers, cookies, navigation).
 */

const API_BASE_URL = process.env.API_BASE_URL;

export async function loginUser(credentials: TLoginInput): Promise<TAuthResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const result = await response.json().catch(() => ({ message: "Internal server error" }));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Invalid credentials.",
                errors: result.errors,
            };
        }

        // Extract tokens from body and headers (robust check)
        const accessToken = result.data?.token || result.data?.accessToken;
        
        // Refresh token might be in headers (Set-Cookie)
        const setCookieHeaders = response.headers.getSetCookie?.() || 
            [response.headers.get("set-cookie")].filter(Boolean) as string[];
        
        let refreshToken = "";
        if (setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookieString: string) => {
                const parsedCookie = parse(cookieString);
                if (parsedCookie['refreshToken']) {
                    refreshToken = parsedCookie['refreshToken'];
                }
            });
        }

        if (!accessToken || !refreshToken) {
            return {
                success: false,
                message: "Authentication tokens not found in response.",
            };
        }

        return {
            success: true,
            data: { accessToken, refreshToken, user: result.data?.user },
        };
    } catch (error) {
        console.error("[AUTH_SERVICE_LOGIN_ERROR]:", error);
        return { success: false, message: "Communication error with auth service." };
    }
}

export async function registerUser(input: TRegisterInput): Promise<TAuthResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const result = await response.json().catch(() => ({ message: "Internal server error" }));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Registration failed.",
                errors: result.errors,
            };
        }

        // Registration might return tokens or just a success message.
        // If it doesn't return tokens, we treat data as empty tokens for now.
        return {
            success: true,
            data: { 
                accessToken: result.data?.accessToken || "", 
                refreshToken: result.data?.refreshToken || "",
                user: result.data 
            },
        };
    } catch (error) {
        console.error("[AUTH_SERVICE_REGISTER_ERROR]:", error);
        return { success: false, message: "Communication error with auth service." };
    }
}

export async function logoutUser(refreshToken: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });
        return response.ok;
    } catch (error) {
        console.error("[AUTH_SERVICE_LOGOUT_ERROR]:", error);
        return false;
    }
}
