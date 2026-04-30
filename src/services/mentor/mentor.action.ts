"use server";

import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";
import { TActionState } from "@/services/auth/auth.types";
import { validateWithSchema } from "@/lib/validation";
import { z } from "zod";
import { MentorManagementResponse } from "./mentor.types";
import { jwtDecode } from "jwt-decode";
import { TJWTPayload } from "@/services/auth/auth.types";
import * as AuthSession from "@/services/auth/session";

/**
 * MENTOR SERVICE ACTIONS (v6.1 - Unified Admin & Discovery)
 * High-performance orchestration for both public discovery and admin-side provisioning.
 */

// ─── VALIDATION SCHEMAS ──────────────────────────────────────────────────────

const createMentorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
  headline: z.string().optional(),
  designation: z.string().optional(),
  experience: z.coerce.number().min(0),
  currentWorkingPlace: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  specialties: z.array(z.string()).or(z.string()).optional(),
});

const updateMentorSchema = z.object({
  headline: z.string().optional(),
  designation: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  currentWorkingPlace: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  specialties: z.array(z.string()).or(z.string()).optional(),
});

// ─── DISCOVERY ACTIONS (PUBLIC) ──────────────────────────────────────────────

export async function getAllMentors(params: { 
  searchTerm?: string; 
  specialties?: string[];
  page?: number;
  limit?: number;
} = {}) {
  try {
    const query = new URLSearchParams();
    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.specialties?.length) {
      params.specialties.forEach(s => query.append("specialties", s));
    }
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const response = await serverFetch.get(`/mentors?${query.toString()}`, { cache: 'no-store' });
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to fetch mentors" };
    }

    return { 
      success: true, 
      data: result.data, 
      meta: result.meta 
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

export async function getMentorDetails(id: string) {
  try {
    const response = await serverFetch.get(`/mentors/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Mentor details not found" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: "Communication error" };
  }
}

export async function getSpecialties() {
  try {
    const response = await serverFetch.get("/specialties?limit=100");
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: "Could not fetch categories" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: "Network error fetching specialties" };
  }
}

// ─── ADMIN ACTIONS (PROTECTED) ───────────────────────────────────────────────

export async function fetchMentors(paramsStr: string): Promise<MentorManagementResponse> {
  try {
    const res = await serverFetch.get(`/mentors?${paramsStr}`, { cache: "no-store" });
    if (!res.ok) return { data: [], meta: null };

    const payload = await res.json();
    return {
      data: payload.data || [],
      meta: payload.meta || null,
    };
  } catch (error) {
    return { data: [], meta: null };
  }
}

export async function createMentorAction(
  _prevState: any,
  formData: FormData
): Promise<TActionState> {
  const validated = validateWithSchema(formData, createMentorSchema);
  if (!validated.success) return validated.state;

  try {
    const res = await serverFetch.post("/users/register-mentor", {
      body: JSON.stringify(validated.data),
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.message || "Provisioning failed" };
    }

    revalidatePath("/admin/dashboard/mentor-management");
    return { success: true, message: "Mentor deployed successfully" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function updateMentorAction(
  id: string,
  _prevState: any,
  formData: FormData
): Promise<TActionState> {
  const validated = validateWithSchema(formData, updateMentorSchema);
  if (!validated.success) return validated.state;

  try {
    const res = await serverFetch.patch(`/mentors/${id}`, {
      body: JSON.stringify(validated.data),
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.message || "Failed to update record" };
    }

    revalidatePath("/admin/dashboard/mentor-management");
    return { success: true, message: "Mentor record updated" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function deleteMentorAction(id: string): Promise<TActionState> {
  try {
    const res = await serverFetch.delete(`/mentors/${id}`);
    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Decomposition failed" };
    }

    revalidatePath("/admin/dashboard/mentor-management");
    return { success: true, message: "Mentor record removed" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function verifyMentorAction(id: string, isVerified: boolean): Promise<TActionState> {
  try {
    const res = await serverFetch.patch(`/mentors/verify/${id}`, {
      body: JSON.stringify({ isVerified }),
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.message || "Verification sync failed" };
    }

    revalidatePath("/admin/dashboard/mentor-management");
    return { success: true, message: `Mentor ${isVerified ? "verified" : "unverified"} successfully` };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function getAllSlotsAction(params: { 
  mentorId?: string; 
  status?: string; 
  page?: number; 
  limit?: number;
} = {}) {
  try {
    const query = new URLSearchParams();
    if (params.mentorId) query.set("mentorId", params.mentorId);
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const response = await serverFetch.get(`/availability-slots?${query.toString()}`, { cache: "no-store" });
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to fetch platform slots" };
    }

    return { 
      success: true, 
      data: result.data || [], 
      meta: result.meta 
    };
  } catch (error: any) {
    return { success: false, message: "Internal sync error" };
  }
}
