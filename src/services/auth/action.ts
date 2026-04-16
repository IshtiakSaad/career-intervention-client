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
 * ACTIONS LAYER: Next.js Boundary / Orchestration (v10.0)
 * Flow: Validation -> Service Call -> Session Update -> Redirect/Return.
 * Enforces server-side authority for session lifecycles.
 */

/**
 * Guard utility for protected routes to ensure identity freshness.
 */
export async function validateUserSession(): Promise<string | never> {
    const token = await AuthSession.getAccessToken();
    if (!token) {
        redirect("/login");
    }
    return token;
}

export async function registerUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState | never> {
    const validated = validateWithSchema(formData, registerValidationSchema);
    if (!validated.success) return validated.state;

    const result = await AuthService.registerUser(validated.data);
    if (!result.success) {
        return { success: false, message: result.message, errors: result.errors };
    }

    // Server-side authority: redirect to login after successful registration
    redirect("/login");
}

export async function loginUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState | never> {
    const validated = validateWithSchema(formData, loginValidationSchema);
    if (!validated.success) return validated.state;

    const result = await AuthService.loginUser(validated.data);
    if (!result.success) {
        return { success: false, message: result.message, errors: result.errors };
    }

    // Update Session Layer (Hardened Cookies)
    await AuthSession.setAuthTokens(result.data);

    let userRole: UserRole = "MENTEE";
    try {
        const decoded = jwtDecode<TJWTPayload>(result.data.accessToken);
        userRole = (decoded.roles?.[0] as UserRole) || "MENTEE";
    } catch (e) {
        console.error("[ACTION_TOKEN_DECODE_ERROR]:", e);
    }

    revalidatePath("/");
    
    // Deterministic server-side navigation
    redirect(ROLE_ROUTES[userRole] || "/dashboard");
}

export async function logoutUserAction(): Promise<never> {
    const tokens = await AuthSession.getAuthTokens();

    try {
        // Revoke on backend
        if (tokens?.refreshToken) {
            await AuthService.logoutUser(tokens.refreshToken);
        }
    } finally {
        // Fail-Hard: Always clear local session even if backend revocation fails
        await AuthSession.clearAuthTokens();
        
        revalidatePath("/");
        redirect("/login");
    }
}
