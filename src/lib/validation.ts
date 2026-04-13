import { ZodSchema } from "zod";
import { TActionState } from "@/services/auth/auth.types";

/**
 * Validates FormData against a Zod schema.
 * Returns either the parsed data or a structured TActionState error.
 */
export function validateWithSchema<T>(
    formData: FormData,
    schema: ZodSchema<T>,
    defaultErrorMessage: string = "Validation failed. Please correct the highlighted errors."
): { success: true; data: T } | { success: false; state: TActionState } {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = schema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            state: {
                success: false,
                message: defaultErrorMessage,
                errors: validatedFields.error.flatten().fieldErrors,
            },
        };
    }

    return {
        success: true,
        data: validatedFields.data,
    };
}
