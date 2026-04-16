import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { TAuthTokens } from "./auth.types";

/**
 * Session Layer (Internal): Handles persistence of authentication tokens.
 * Enforces strict security policies (HttpOnly, Secure, SameSite) and
 * provides expiry-aware accessors to the rest of the application.
 */

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const COOKIE_CONFIG = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
};

/**
 * Checks if a JWT token is expired or malformed.
 */
function isExpired(token: string): boolean {
    try {
        const decoded: any = jwtDecode(token);
        if (!decoded.exp) return true;
        
        // Add a 10-second buffer to handle clock drift/latency
        const buffer = 10; 
        return Math.floor(Date.now() / 1000) >= (decoded.exp - buffer);
    } catch {
        return true;
    }
}

/**
 * Sets both access and refresh tokens with strict security flags.
 */
export async function setAuthTokens(tokens: TAuthTokens) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", tokens.accessToken, {
        ...COOKIE_CONFIG,
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
        ...COOKIE_CONFIG,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

/**
 * Retrieves the accessToken only if it is valid (not expired).
 */
export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    if (!token || isExpired(token)) return null;
    return token;
}

/**
 * Retrieves the refreshToken (raw, as it has a much longer shelf-life).
 */
export async function getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value || null;
}

/**
 * Full session retrieval for legacy support or bulk checks.
 */
export async function getAuthTokens(): Promise<TAuthTokens | null> {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (!accessToken || !refreshToken) {
        return null;
    }

    return { accessToken, refreshToken };
}

/**
 * Clears all tokens by overwriting them with maxAge: 0.
 * This ensures deterministic browser eviction across all environments.
 */
export async function clearAuthTokens() {
    const cookieStore = await cookies();
    
    cookieStore.set("accessToken", "", { ...COOKIE_CONFIG, maxAge: 0 });
    cookieStore.set("refreshToken", "", { ...COOKIE_CONFIG, maxAge: 0 });
}
