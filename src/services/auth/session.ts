import { cookies } from "next/headers";
import { TAuthTokens } from "./auth.types";

/**
 * Session Layer: Handles persistence of authentication tokens in cookies.
 * Enforces strict security policies (HttpOnly, Secure, SameSite).
 */

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAuthTokens(tokens: TAuthTokens) {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

export async function getAuthTokens(): Promise<TAuthTokens | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
        return null;
    }

    return { accessToken, refreshToken };
}

export async function clearAuthTokens() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
}
