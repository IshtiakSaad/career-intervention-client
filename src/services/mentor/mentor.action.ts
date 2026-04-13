/* eslint-disable no-restricted-imports */
"use server";

import { serverFetch } from "@/lib/serverFetch";
import { MentorManagementResponse } from "./mentor.types";
import { revalidatePath } from "next/cache";
import { TActionState } from "@/services/auth/auth.types";
import { validateWithSchema } from "@/lib/validation";
import { z } from "zod";

/**
 * Zod Schema for Mentor Profile Updates
 */
const mentorUpdateSchema = z.object({
    designation: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    bio: z.string().optional(),
    experience: z.coerce.number().optional(),
});

/**
 * Zod Schema for Mentor Creation (By Admin)
 */
const mentorCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    designation: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    experience: z.coerce.number().optional().default(0),
    bio: z.string().optional(),
});

/**
 * Fetch all mentors with server-side proxy
 */
export async function fetchMentors(paramsStr: string): Promise<MentorManagementResponse> {
    try {
        const res = await serverFetch.get(`/mentors?${paramsStr}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("[MENTOR_FETCH_ERROR]: Backend returned", res.status);
            return { data: [], meta: null };
        }

        const payload = await res.json();
        return {
            data: Array.isArray(payload.data) ? payload.data : [],
            meta: payload.meta || null,
        };
    } catch (error) {
        console.error("[MENTOR_FETCH_ERROR]:", error);
        return { data: [], meta: null };
    }
}

/**
 * Creates a new Mentor (User + Profile)
 */
export async function createMentorAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, mentorCreateSchema);
    if (!validated.success) return validated.state;

    try {
        const res = await serverFetch.post("/users", {
            body: JSON.stringify({
                ...validated.data,
                role: "MENTOR", // Enforce role at the service layer
            }),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "Failed to create mentor" };
        }

        revalidatePath("/admin/dashboard/mentor-management");
        return { success: true, message: "Mentor account created successfully" };
    } catch (error) {
        console.error("[CREATE_MENTOR_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}

/**
 * Toggles the verification badge of a mentor
 */
export async function verifyMentorAction(id: string, isVerified: boolean): Promise<TActionState> {
    try {
        const res = await serverFetch.patch(`/mentors/verify/${id}`, {
            body: JSON.stringify({ isVerified }),
        });

        if (!res.ok) {
             const result = await res.json();
             return { success: false, message: result.message || "Failed to update verification status" };
        }

        revalidatePath("/admin/dashboard/mentor-management");
        return { success: true, message: `Mentor ${isVerified ? 'verified' : 'unverified'} successfully` };
    } catch (error) {
        console.error("[VERIFY_MENTOR_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}

/**
 * Soft deletes a mentor by updating the User record
 */
export async function deleteMentorAction(id: string): Promise<TActionState> {
    try {
        const res = await serverFetch.delete(`/mentors/${id}`);
        
        if (!res.ok) {
            const result = await res.json();
            return { success: false, message: result.message || "Failed to delete mentor" };
        }

        revalidatePath("/admin/dashboard/mentor-management");
        return { success: true, message: "Mentor record removed successfully" };
    } catch (error) {
        console.error("[DELETE_MENTOR_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}

/**
 * Updates mentor profile details
 */
export async function updateMentorAction(
    id: string,
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, mentorUpdateSchema);
    if (!validated.success) return validated.state;

    try {
        const res = await serverFetch.patch(`/mentors/${id}`, {
            body: JSON.stringify(validated.data),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "Failed to update mentor profile" };
        }

        revalidatePath("/admin/dashboard/mentor-management");
        return { success: true, message: "Mentor profile updated successfully" };
    } catch (error) {
        console.error("[UPDATE_MENTOR_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}
