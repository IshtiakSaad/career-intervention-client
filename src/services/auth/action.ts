"use server";

import { cookies } from "next/headers";
import { parse } from "cookie";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { registerValidationSchema, loginValidationSchema } from "./auth.validation";
import { TActionState } from "./auth.types";
import { ROLE_ROUTES, UserRole } from "@/constants/routes";
import { deleteCookie } from "@/lib/cookie-utils";

import { validateWithSchema } from "@/lib/validation";

/**
 * Registration Action: Handles new user account creation.
 */
export async function registerUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, registerValidationSchema);

    if (!validated.success) {
        return validated.state;
    }

    const validatedData = validated.data;


    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`;
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json",
            },
        });

        const result = await response.json().catch(() => ({ message: "Internal server error" }));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "An error occurred during registration.",
                errors: result.errors,
            };
        }

        // ATOMIC LOGIN: Chaining the login call immediately after successful registration
        const loginState = await loginUserAction(_prevState, formData);
        
        // If login failed for some reason after registration succeeded
        if (!loginState?.success) {
            return {
                success: false,
                message: "Registration successful, but automatic login failed. Please sign in manually.",
            };
        }

        // Success is handled by redirect inside loginUserAction
        return loginState;

    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Let Next.js handle the redirect from loginUserAction
        }
        console.error("[REGISTER_ACTION_ERROR]:", error);
        return {
            success: false,
            message: "The server is currently unreachable. Please try again later.",
        };
    }
}

/**
 * Login Action: Verifies user credentials and starts a session.
 */
export async function loginUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const validated = validateWithSchema(formData, loginValidationSchema);

    if (!validated.success) {
        return validated.state;
    }

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(validated.data),

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        const result = await response.json().catch(() => ({ message: "Internal server error" }));

        if (!response.ok) {
            return {
                success: false,
                message: result.message || "Invalid credentials. Please try again.",
                errors: result.errors,
            };
        }

        // -----------------------------------------------------
        // NEXT.JS BACKEND COOKIE STORAGE 
        // -----------------------------------------------------
        const cookieStore = await cookies();
        let userRole: UserRole = "MENTEE";

        // 1. Grab the Access Token from JSON Data
        const accessToken = result.data?.token || result.data?.accessToken;
        if (accessToken) {
            // Decode role from token for redirection
            try {
                const decoded: any = jwtDecode(accessToken);
                userRole = (decoded.roles?.[0] as UserRole) || "MENTEE";
            } catch (e) {
                console.error("[TOKEN_DECODE_ERROR]:", e);
            }

            cookieStore.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15, // 15 Mins
            });
        }

        // 2. Grab the Refresh Token from the Backend's Set-Cookie Headers
        const setCookieHeaders = response.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookieString: string) => {
                const parsedCookie = parse(cookieString);

                if (parsedCookie['refreshToken']) {
                    cookieStore.set("refreshToken", parsedCookie['refreshToken'], {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/", // Scope to /auth/refresh if backend supports it
                        maxAge: 60 * 60 * 24 * 7, // 7 Days
                    });
                }
            });
        }

        revalidatePath("/");
        
        // ELIMINATE Cookie Commit Race Condition: 
        // Use Server-side redirect instead of returning state for success.
        redirect(ROLE_ROUTES[userRole] || "/dashboard");

    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Let Next.js handle the redirect
        }
        console.error("[LOGIN_ACTION_ERROR]:", error);
        return {
            success: false,
            message: "The server is currently unreachable. Please try again later.",
        };
    }
}
/**
 * Logout Action: Invalidates session on backend and clears browser cookies.
 */
export async function logoutUserAction() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    try {
        // 1. BACKEND SESSION INVALIDATION
        if (refreshToken) {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });
        }
    } catch (error) {
        // Log the failure for security auditing, but continue to clear local session
        console.error("[LOGOUT_BACKEND_REVOCATION_FAILED]:", error);
    } finally {
        // 2. FORCEFUL COOKIE CLEANUP
        // Even if backend fails, we must ensure the user is logged out locally
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");

        revalidatePath("/");
        redirect("/login");
    }
}
