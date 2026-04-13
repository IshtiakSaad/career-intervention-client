"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

/**
 * Creates or updates a cookie.
 */
export const setCookie = async (key: string, value: string, options: Partial<ResponseCookie> = {}) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        ...options,
    });
}

/**
 * Retrieves the value of a cookie.
 */
export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value || null;
}

/**
 * Deletes a cookie by matching its creation flags.
 */
export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete({
        name: key,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
}
