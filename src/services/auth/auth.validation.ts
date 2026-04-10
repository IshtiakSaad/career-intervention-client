import { z } from "zod";

/**
 * Validation schema for user registration.
 */
export const registerValidationSchema = z.object({
    name: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password must be at most 50 characters"),
    phoneNumber: z.string().optional().or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    careerGoals: z.string().optional().or(z.literal("")),
    file: z.any().optional(),
});

/**
 * Validation schema for user login.
 */
export const loginValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type TRegisterInput = z.infer<typeof registerValidationSchema>;
export type TLoginInput = z.infer<typeof loginValidationSchema>;
