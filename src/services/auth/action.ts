"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { registerValidationSchema, loginValidationSchema } from "./auth.validation";
import { TActionState, TJWTPayload } from "./auth.types";
import { ROLE_ROUTES, UserRole } from "@/constants/routes";
import { validateWithSchema } from "@/lib/validation";

import * as AuthService from "./service";
import * as AuthSession from "./session";

/**
 * ACTIONS LAYER: Next.js Boundary / Orchestration.
 * Flow: Validation -> Service Call -> Session Update -> Return Result.
 */

export async function registerUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    // 1. Validation
    const validated = validateWithSchema(formData, registerValidationSchema);
    if (!validated.success) return validated.state;

    // 2. Service Call
    const result = await AuthService.registerUser(validated.data);
    if (!result.success) {
        return { success: false, message: result.message, errors: result.errors };
    }

    // 3. Orchestration Logic
    return {
        success: true,
        message: "Registration successful! Tracking your potential. Please sign in.",
        redirectTo: "/login",
    };
}

export async function loginUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    // 1. Validation
    const validated = validateWithSchema(formData, loginValidationSchema);
    if (!validated.success) return validated.state;

    // 2. Service Call
    const result = await AuthService.loginUser(validated.data);
    if (!result.success) {
        return { success: false, message: result.message, errors: result.errors };
    }

    // 3. Session Layer Update
    await AuthSession.setAuthTokens(result.data);

    // 4. Orchestration / Routing Logic
    let userRole: UserRole = "MENTEE";
    try {
        const decoded = jwtDecode<TJWTPayload>(result.data.accessToken);
        userRole = (decoded.roles?.[0] as UserRole) || "MENTEE";
    } catch (e) {
        console.error("[ACTION_TOKEN_DECODE_ERROR]:", e);
    }

    revalidatePath("/");

    return {
        success: true,
        message: "Signed in successfully!",
        redirectTo: ROLE_ROUTES[userRole] || "/dashboard",
    };
}

export async function logoutUserAction() {
    // 1. Session Retrieval
    const tokens = await AuthSession.getAuthTokens();

    try {
        // 2. Service Call (Revoke on backend)
        if (tokens?.refreshToken) {
            await AuthService.logoutUser(tokens.refreshToken);
        }
    } finally {
        // 3. Clear Local Session
        await AuthSession.clearAuthTokens();
        
        revalidatePath("/");
        redirect("/login");
    }
}
