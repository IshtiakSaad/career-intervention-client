"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";
import { getCurrentUser } from "./user.action";

/**
 * Profile Update Actions — Sectional Lifecycle.
 *
 * Each section of the profile has its own Server Action with PATCH semantics.
 * This ensures:
 * - Minimal payload (only changed fields are sent)
 * - Isolated validation failures
 * - No cross-field race conditions
 */

// ─── General Info (Name, Phone, Timezone, Gender) ───

export async function updateGeneralInfoAction(
    _prevState: any,
    formData: FormData
): Promise<any> {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "Session expired. Please log in again." };
    }

    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const timezone = formData.get("timezone") as string;
    const gender = formData.get("gender") as string;

    // PATCH semantics: only send fields that have values
    const payload: Record<string, any> = {};
    if (name?.trim()) payload.name = name.trim();
    if (phoneNumber?.trim()) payload.phoneNumber = phoneNumber.trim();
    if (timezone?.trim()) payload.timezone = timezone.trim();
    if (gender?.trim()) payload.gender = gender.trim();

    if (Object.keys(payload).length === 0) {
        return { success: false, message: "No changes detected." };
    }

    try {
        const idempotencyKey = crypto.randomUUID();
        const res = await serverFetch.patch(`/users/${user.id}`, {
            body: JSON.stringify(payload),
            idempotencyKey,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            console.error("[PROFILE_UPDATE]: General info update failed.", {
                event: "PROFILE_UPDATE_FAILED",
                section: "general",
                userId: user.id,
                status: res.status,
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                message: error.message || "Failed to update profile.",
                fields: { name, phoneNumber, timezone, gender },
            };
        }

        (revalidateTag as any)("user-profile");
        return { success: true, message: "Profile updated successfully." };
    } catch (error) {
        console.error("[PROFILE_UPDATE]: Network error during general info update.", {
            event: "PROFILE_UPDATE_ERROR",
            section: "general",
            userId: user.id,
            error: String(error),
            timestamp: new Date().toISOString(),
        });
        return { success: false, message: "A network error occurred. Please try again." };
    }
}

// ─── Mentor Professional Info (Bio, Headline, Designation, etc.) ───

export async function updateMentorProfessionalAction(
    _prevState: any,
    formData: FormData
): Promise<any> {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "Session expired. Please log in again." };
    }

    if (!user.roles.includes("MENTOR")) {
        return { success: false, message: "Unauthorized: Mentor role required." };
    }

    const bio = formData.get("bio") as string;
    const headline = formData.get("headline") as string;
    const designation = formData.get("designation") as string;
    const currentWorkingPlace = formData.get("currentWorkingPlace") as string;
    const location = formData.get("location") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;

    const payload: Record<string, any> = {};
    if (bio !== null) payload.bio = bio?.trim() || "";
    if (headline !== null) payload.headline = headline?.trim() || "";
    if (designation !== null) payload.designation = designation?.trim() || "";
    if (currentWorkingPlace !== null) payload.currentWorkingPlace = currentWorkingPlace?.trim() || "";
    if (location !== null) payload.location = location?.trim() || "";
    if (linkedinUrl !== null) payload.linkedinUrl = linkedinUrl?.trim() || "";
    if (portfolioUrl !== null) payload.portfolioUrl = portfolioUrl?.trim() || "";

    try {
        const mentorProfileId = user.mentorProfile?.id;
        if (!mentorProfileId) {
            return { success: false, message: "Mentor profile not found." };
        }

        const idempotencyKey = crypto.randomUUID();
        const res = await serverFetch.patch(`/mentors/${mentorProfileId}`, {
            body: JSON.stringify(payload),
            idempotencyKey,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            console.error("[PROFILE_UPDATE]: Mentor professional update failed.", {
                event: "PROFILE_UPDATE_FAILED",
                section: "mentor-professional",
                userId: user.id,
                status: res.status,
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                message: error.message || "Failed to update mentor profile.",
                fields: { bio, headline, designation, currentWorkingPlace, location, linkedinUrl, portfolioUrl },
            };
        }

        (revalidateTag as any)("user-profile");
        return { success: true, message: "Professional profile updated successfully." };
    } catch (error) {
        console.error("[PROFILE_UPDATE]: Network error during mentor update.", {
            event: "PROFILE_UPDATE_ERROR",
            section: "mentor-professional",
            userId: user.id,
            error: String(error),
            timestamp: new Date().toISOString(),
        });
        return { success: false, message: "A network error occurred. Please try again." };
    }
}
