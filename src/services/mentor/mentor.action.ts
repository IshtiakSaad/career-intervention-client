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
    designation: z.string().min(2, "Designation must be a valid title").optional(),
    currentWorkingPlace: z.string().optional(),
    bio: z.string().min(50, "Bio must be at least 50 characters for a professional profile").optional(),
    experience: z.coerce.number().min(0, "Experience cannot be negative").optional(),
    headline: z.string().min(10, "Headline must be at least 10 characters").max(100).optional(),
    location: z.string().optional(),
    linkedinUrl: z.string().url("Invalid LinkedIn URL format").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid Portfolio URL format").optional().or(z.literal("")),
    specialties: z.array(z.string()).optional(),
});

/**
 * Zod Schema for Mentor Creation (By Admin)
 */
const mentorCreateSchema = z.object({
    name: z.string().min(2, "Full legal name is required"),
    email: z.string().email("Invalid system identifier (email)"),
    phoneNumber: z.string().min(6, "Valid phone line is required"),
    password: z.string().min(6, "Access key must be at least 6 characters"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    designation: z.string().min(2, "Designation is required for profile indexing"),
    experience: z.coerce.number().min(0, "Experience cannot be negative").default(0),
    currentWorkingPlace: z.string().min(2, "Current organization is required"),
    headline: z.string().min(10, "Headline must be at least 10 characters").max(100),
    location: z.string().min(2, "Operations base (location) is required"),
    linkedinUrl: z.string().url("Invalid LinkedIn URL format").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid Portfolio URL format").optional().or(z.literal("")),
    bio: z.string().min(50, "Comprehensive bio (min 50 chars) is required for verification"),
    specialties: z.array(z.string()).min(1, "At least one core expertise is required"),
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
 * Creates a new Mentor (User + Profile + Specialties)
 */
export async function createMentorAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    // 1. Manually extract specialties as an array (standard fromEntries squashes them)
    const rawData = Object.fromEntries(formData.entries());
    const specialties = formData.getAll("specialties");
    
    // 2. Prepare data for validation
    const dataToValidate = {
        ...rawData,
        specialties: specialties.length > 0 ? specialties : [],
    };

    // 3. Perform manual validation to handle array fields correctly
    const validatedFields = mentorCreateSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed. Please check the form.",
            errors: validatedFields.error.flatten().fieldErrors,
            fields: dataToValidate,
        };
    }

    try {
        const res = await serverFetch.post("/users", {
            body: JSON.stringify({
                ...validatedFields.data,
                role: "MENTOR",
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
    // 1. Extract specialties as an array to avoid flattening
    const rawData = Object.fromEntries(formData.entries());
    const specialties = formData.getAll("specialties");

    const dataToValidate = {
        ...rawData,
        specialties: specialties.length > 0 ? specialties : undefined,
    };

    const validated = mentorUpdateSchema.safeParse(dataToValidate);
    
    if (!validated.success) {
        return {
            success: false,
            message: "Validation failed. Please check the form.",
            errors: validated.error.flatten().fieldErrors,
            fields: dataToValidate,
        };
    }

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
