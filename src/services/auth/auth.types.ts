import { z } from "zod";

export const JWTPayloadSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    email: z.string().email().optional(),
    roles: z.array(z.string().min(1)).min(1),
    iat: z.number().optional(),
    exp: z.number().optional(),
});

export type TJWTPayload = z.infer<typeof JWTPayloadSchema>;

export type TAuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type TAuthResult =
    | { success: true; data: TAuthTokens & { user?: any } }
    | { success: false; message: string; errors?: Record<string, string[] | undefined> };

export type TActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[] | undefined>;
    fields?: Record<string, any>;
    data?: any;
    redirectTo?: string;
} | null;
