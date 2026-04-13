"use server";

import { serverFetch } from "@/lib/serverFetch";
// eslint-disable-next-line no-restricted-imports
import { SpecialtyManagementResponse } from "./specialty.types";
import { revalidatePath } from "next/cache";
import { TActionState } from "@/services/auth/auth.types";
import { validateWithSchema } from "@/lib/validation";
import { z } from "zod";

const specialtySchema = z.object({
    name: z.string().min(1, "Name is required"),
    icon: z.string().optional(),
});


export async function fetchSpecialties(
    paramsStr: string
): Promise<SpecialtyManagementResponse> {
    try {
        const res = await serverFetch.get(`/specialties?${paramsStr}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("[SPECIALTY_FETCH_ERROR]: Backend returned", res.status);
            return { data: [], meta: null };
        }

        const payload = await res.json();
        return {
            data: Array.isArray(payload.data) ? payload.data : payload,
            meta: payload.meta || null,
        };
    } catch (error) {
        console.error("[SPECIALTY_FETCH_ERROR]:", error);
        return { data: [], meta: null };
    }
}


export async function createSpecialtyAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, specialtySchema);
    if (!validated.success) return validated.state;

    try {
        const res = await serverFetch.post("/specialties", {
            body: JSON.stringify(validated.data),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "Failed to create specialty" };
        }

        revalidatePath("/admin/dashboard/specialities-management");
        return { success: true, message: "Specialty created successfully" };
    } catch (error) {
        console.error("[CREATE_SPECIALTY_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}

export async function updateSpecialtyAction(
    id: string,
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, specialtySchema.partial());
    if (!validated.success) return validated.state;

    try {
        const res = await serverFetch.patch(`/specialties/${id}`, {
            body: JSON.stringify(validated.data),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "Failed to update specialty" };
        }

        revalidatePath("/admin/dashboard/specialities-management");
        return { success: true, message: "Specialty updated successfully" };
    } catch (error) {
        console.error("[UPDATE_SPECIALTY_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}

export async function deleteSpecialtyAction(id: string): Promise<TActionState> {
    try {
        const res = await serverFetch.delete(`/specialties/${id}`);
        const result = await res.json();

        if (!res.ok) {
            return { success: false, message: result.message || "Failed to delete specialty" };
        }

        revalidatePath("/admin/dashboard/specialities-management");
        return { success: true, message: "Specialty deleted successfully" };
    } catch (error) {
        console.error("[DELETE_SPECIALTY_ERROR]:", error);
        return { success: false, message: "External server error" };
    }
}
