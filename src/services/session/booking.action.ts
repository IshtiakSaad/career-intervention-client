"use server";

import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";

/**
 * BOOKING & SUPPLY ACTIONS (v6.0)
 * Orchestrates mentor availability and session creation.
 */

export async function getMentorSlots(mentorId: string) {
    try {
        const response = await serverFetch.get(`/availability-slots?mentorId=${mentorId}&status=AVAILABLE`);
        const result = await response.json();

        if (!response.ok) {
            return { success: false, message: result.message || "Failed to fetch slots" };
        }

        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, message: "Could not sync mentor availability" };
    }
}

export async function bookSession(payload: {
    serviceOfferingId: string;
    availabilitySlotId: string;
    description?: string;
}) {
    try {
        const response = await serverFetch.post("/sessions/book", {
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            return { 
                success: false, 
                message: result.message || "Booking failed. Please try again." 
            };
        }

        revalidatePath("/mentee/dashboard/my-appointments");
        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, message: "Booking communication error" };
    }
}
