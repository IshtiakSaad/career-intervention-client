"use server";

import { serverFetch } from "@/lib/serverFetch";
import { AdminManagementResponse } from "./admin.types";

export async function fetchAdmins(paramsStr: string): Promise<AdminManagementResponse> {
    try {
        const res = await serverFetch.get(`/admins?${paramsStr}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("[ADMIN_FETCH_ERROR]: Backend returned", res.status);
            return { data: [], meta: null };
        }

        const payload = await res.json();
        return {
            data: Array.isArray(payload.data) ? payload.data : payload,
            meta: payload.meta || null,
        };
    } catch (error) {
        console.error("[ADMIN_FETCH_ERROR]:", error);
        return { data: [], meta: null };
    }
}
