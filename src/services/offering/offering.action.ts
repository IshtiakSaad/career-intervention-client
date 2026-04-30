"use server";

import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";
import { TActionState } from "@/services/auth/auth.types";
import { validateWithSchema } from "@/lib/validation";
import { z } from "zod";
import * as AuthAction from "@/services/auth/action";

/**
 * SERVICE OFFERING ACTIONS (v7.0)
 * Orchestrates mentor-side consultation pricing and duration management.
 */

const offeringSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(5, "Minimum duration is 5 minutes"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  currency: z.string().default("USD"),
});

export async function getMyOfferings() {
  try {
    const user = await AuthAction.getCurrentUser();
    if (!user || !user.email) return { success: false, message: "Unauthorized" };

    const res = await serverFetch.get(`/services?userId=${user.userId}`);
    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Failed to fetch services" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: "Connection error" };
  }
}

export async function createOfferingAction(
  _prevState: any,
  formData: FormData
): Promise<TActionState> {
  const validated = validateWithSchema(formData, offeringSchema);
  if (!validated.success) return validated.state;

  try {
    const res = await serverFetch.post("/services", {
      body: JSON.stringify(validated.data),
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.message || "Provisioning failed" };
    }

    revalidatePath("/mentor/dashboard/my-services");
    revalidatePath("/mentors"); // Revalidate discovery page
    return { success: true, message: "Consultation type deployed" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function updateOfferingAction(
  id: string,
  _prevState: any,
  formData: FormData
): Promise<TActionState> {
  const validated = validateWithSchema(formData, offeringSchema);
  if (!validated.success) return validated.state;

  try {
    const res = await serverFetch.patch(`/services/${id}`, {
      body: JSON.stringify(validated.data),
    });

    const result = await res.json();
    if (!res.ok) {
      return { success: false, message: result.message || "Update failed" };
    }

    revalidatePath("/mentor/dashboard/my-services");
    revalidatePath("/mentors");
    return { success: true, message: "Service conditions updated" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}

export async function deleteOfferingAction(id: string): Promise<TActionState> {
  try {
    const res = await serverFetch.delete(`/services/${id}`);
    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Decomposition failed" };
    }

    revalidatePath("/mentor/dashboard/my-services");
    revalidatePath("/mentors");
    return { success: true, message: "Service offering removed" };
  } catch (error) {
    return { success: false, message: "External server error" };
  }
}
