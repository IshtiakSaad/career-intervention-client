"use server";

import { serverFetch } from "@/lib/serverFetch";
import { ISession, SessionStatus } from "@/types/session";
import { revalidatePath } from "next/cache";

/**
 * PRODUCTION-GRADE SESSION ACTIONS (v4.0)
 * Uses the hardened serverFetch with automatic retry and refresh coordination.
 */

export async function getMySessions() {
    try {
        const response = await serverFetch.get("/sessions/my-sessions");
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to fetch sessions" };
        }
        
        return { success: true, data: result.data as ISession[] };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function bookSession(payload: {
    availabilitySlotId: string;
    serviceId: string;
    notes?: string;
    idempotencyKey: string;
}) {
    try {
        const response = await serverFetch.post("/sessions/book", {
            body: JSON.stringify(payload),
            // Pass the idempotency key to the transport layer for additional hardware safety
            idempotencyKey: payload.idempotencyKey,
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to book session" };
        }
        
        revalidatePath("/dashboard/my-appointments");
        return { success: true, data: result.data as ISession };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function updateSessionStatus(id: string, payload: {
    status?: SessionStatus;
    meetingLink?: string;
    notes?: string;
    version: number; // Mandatory for optimistic concurrency
}) {
    try {
        const response = await serverFetch.patch(`/sessions/${id}`, {
            body: JSON.stringify(payload),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { 
                success: false, 
                message: result.message || "Failed to update session",
                // Return version conflict hint if applicable
                isConflict: response.status === 409 
            };
        }
        
        revalidatePath("/dashboard/my-appointments");
        revalidatePath("/mentor/dashboard/appointments");
        return { success: true, data: result.data as ISession };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}
