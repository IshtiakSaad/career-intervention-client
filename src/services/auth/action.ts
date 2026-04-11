"use server";

import { cookies } from "next/headers";
import { parse } from "cookie";
import { revalidatePath } from "next/cache";
import { registerValidationSchema, loginValidationSchema } from "./auth.validation";
import { TActionState } from "./auth.types";

/**
 * Registration Action: Handles new user account creation.
 */
export async function registerUserAction(
    _prevState: TActionState,
    formData: FormData
): Promise<TActionState> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = registerValidationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed. Please correct the highlighted errors.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/v1/register`;
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

        revalidatePath("/");
        
        return {
            success: true,
            message: "Account created successfully! Redirecting back to login...",
            data: result.data,
        };

    } catch (error) {
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
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = loginValidationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validation failed. Please correct the highlighted errors.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(validatedFields.data),
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

        // 1. Grab the Access Token from JSON Data
        const accessToken = result.data?.token || result.data?.accessToken;
        if (accessToken) {
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
                        sameSite: "lax", // Keep SameSite strict or lax for security
                        path: "/", // Ensure it covers the whole site (or /api for stricter security)
                        maxAge: 60 * 60 * 24 * 7, // 7 Days
                    });
                }
            });
        }

        revalidatePath("/");
        
        return {
            success: true,
            message: "Success! Redirecting to your dashboard...",
            data: result.data,
        };

    } catch (error) {
        console.error("[LOGIN_ACTION_ERROR]:", error);
        return {
            success: false,
            message: "The server is currently unreachable. Please try again later.",
        };
    }
}

