"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { serverFetch } from "@/lib/serverFetch";
import { TUserIdentity, UserManagementResponse } from "./user.types";
import { transformToIdentityModel } from "./user.transformer";

/**
 * Server-only utility to fetch the currently authenticated user.
 *
 * Freshness Model:
 * - Uses `next: { revalidate: 60, tags: ["user-profile"] }` for identity data.
 * - The JWT is treated as a HINT only. The backend response is the source of truth.
 */
export async function getCurrentUser(): Promise<TUserIdentity | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        // JWT is a hint — extract userId for the fetch target
        const decoded: any = jwtDecode(accessToken);
        const userId = decoded.id || decoded.userId || decoded.sub;

        if (!userId) {
            console.error("[GET_CURRENT_USER]: No userId found in JWT payload.");
            return null;
        }

        const response = await serverFetch.get(`/users/${userId}`, {
            next: { revalidate: 60, tags: ["user-profile"] },
        } as any);

        if (!response.ok) {
            console.error("[GET_CURRENT_USER]: Backend returned", response.status, {
                event: "IDENTITY_FETCH_FAILED",
                userId,
                status: response.status,
                timestamp: new Date().toISOString(),
            });
            return null;
        }

        const result = await response.json();
        const rawUser = result.data;

        // ─── The Hard Boundary ───
        // Transform raw backend data through the identity model.
        // If the transformer returns null, the identity contract is broken.
        const identity = transformToIdentityModel(rawUser);

        if (!identity) {
            console.error("[GET_CURRENT_USER]: Identity transformer rejected the payload.", {
                event: "IDENTITY_TRANSFORM_HARD_FAIL",
                userId,
                timestamp: new Date().toISOString(),
            });
            return null;
        }

        return identity;

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
