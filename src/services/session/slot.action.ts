"use server";

import { serverFetch } from "@/lib/serverFetch";
import { IAvailabilitySlot } from "@/types/session";
import { revalidatePath } from "next/cache";

/**
 * AVAILABILITY SLOT SERVER ACTIONS (v4.0)
 */

export async function createAvailabilitySlots(payload: {
    serviceId: string;
    slots: Array<{
        startTime: string; // ISO string (UTC)
        endTime: string;   // ISO string (UTC)
        description?: string;
    }>;
}) {
    try {
        const response = await serverFetch.post("/mentors/my-slots", {
            body: JSON.stringify(payload),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to create slots" };
        }
        
        revalidatePath("/mentor/dashboard/my-schedules");
        return { success: true, data: result.data as IAvailabilitySlot[] };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function bulkCreateAvailabilitySlotsAction(
    payload: {
        serviceId: string;
        startDate: string; 
        endDate: string;   
        weekdays: number[]; 
        dailyStartTime: string; 
        dailyEndTime: string;   
        timezone: string;
    },
    idempotencyKey: string
) {
    try {
        const response = await serverFetch.post("/availability-slots/bulk-create", {
            body: JSON.stringify(payload),
            headers: {
                "x-idempotency-key": idempotencyKey
            }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to bulk generate slots" };
        }
        
        revalidatePath("/mentor/dashboard/my-schedules");
        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function getMySlots() {
    try {
        const response = await serverFetch.get("/mentors/my-slots");
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to fetch slots" };
        }
        
        return { success: true, data: result.data as IAvailabilitySlot[] };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function deleteSlot(id: string) {
    try {
        const response = await serverFetch.delete(`/mentors/my-slots/${id}`);
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to delete slot" };
        }
        
        revalidatePath("/mentor/dashboard/my-schedules");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function bulkDeleteSlotsByDateRange(startIso: string, endIso: string) {
    try {
        const response = await serverFetch.post("/mentors/my-slots/batch-delete", {
            body: JSON.stringify({ startIso, endIso })
        });
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to clear schedule" };
        }
        
        revalidatePath("/mentor/dashboard/my-schedules");
        return { success: true, deletedCount: result.data?.deletedCount || 0 };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}
