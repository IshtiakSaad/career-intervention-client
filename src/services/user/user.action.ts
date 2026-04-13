"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { serverFetch } from "@/lib/serverFetch";
import { TUser, UserManagementResponse } from "./user.types";

/**
 * Server-only utility to fetch the currently authenticated user.
 */
export async function getCurrentUser(): Promise<TUser | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const decoded: any = jwtDecode(accessToken);
        const userId = decoded.id || decoded.userId || decoded.sub;

        if (!userId) {
            console.error("[GET_CURRENT_USER]: No userId found in JWT payload.");
            return null;
        }

        const response = await serverFetch.get(`/users/${userId}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("[GET_CURRENT_USER]: Backend returned", response.status);
            return null;
        }

        const result = await response.json();
        return (result.data as TUser) || null;

    } catch (error) {
        console.error("[GET_CURRENT_USER]:", error);
        return null;
    }
}

/**
 * Server action to fetch mentees or users based on query params.
 */
export async function fetchUsers(paramsStr: string): Promise<UserManagementResponse> {
    try {
        const res = await serverFetch.get(`/users?${paramsStr}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("[USER_FETCH_ERROR]: Backend returned", res.status);
            return { data: [], meta: null };
        }

        const payload = await res.json();
        return {
            data: Array.isArray(payload.data) ? payload.data : [],
            meta: payload.meta || null,
        };
    } catch (error) {
        console.error("[USER_FETCH_ERROR]:", error);
        return { data: [], meta: null };
    }
}
