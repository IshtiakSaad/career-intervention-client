"use server";

import { serverFetch } from "@/lib/serverFetch";
import { IActionPlan, ActionPlanStatus } from "@/types/session";
import { revalidatePath } from "next/cache";

/**
 * ACTION PLAN SERVER ACTIONS (v4.0)
 */

export async function createActionPlan(payload: {
    sessionId: string;
    summary: string;
    tasks: Array<{ title: string; deadline?: string; isDone: boolean }>;
    resources?: Array<{ label: string; url: string }>;
    notes?: string;
}) {
    try {
        const response = await serverFetch.post("/sessions/action-plans", {
            body: JSON.stringify(payload),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to create action plan" };
        }
        
        revalidatePath(`/mentor/dashboard/appointments`);
        return { success: true, data: result.data as IActionPlan };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function updateActionPlan(id: string, payload: {
    summary?: string;
    tasks?: Array<{ title: string; deadline?: string; isDone: boolean }>;
    resources?: Array<{ label: string; url: string }>;
    notes?: string;
    version: number; // Mandatory for optimistic concurrency
}) {
    try {
        const response = await serverFetch.patch(`/sessions/action-plans/${id}`, {
            body: JSON.stringify(payload),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to update action plan" };
        }
        
        revalidatePath(`/dashboard/my-action-plans`);
        return { success: true, data: result.data as IActionPlan };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function submitActionPlan(id: string) {
    try {
        const response = await serverFetch.patch(`/sessions/action-plans/${id}/submit`);
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to submit action plan" };
        }
        
        revalidatePath(`/dashboard/my-action-plans`);
        return { success: true, data: result.data as IActionPlan };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function getActionPlanBySession(sessionId: string) {
    try {
        const response = await serverFetch.get(`/sessions/action-plans/session/${sessionId}`);
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to fetch action plan" };
        }
        
        return { success: true, data: result.data as IActionPlan | null };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

export async function getMyActionPlans() {
    try {
        const response = await serverFetch.get("/sessions/action-plans/mine");
        const result = await response.json();
        
        if (!response.ok) {
            return { success: false, message: result.message || "Failed to fetch action plans" };
        }
        
        return { success: true, data: result.data as IActionPlan[] };
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}
