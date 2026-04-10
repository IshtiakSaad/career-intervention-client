export type TActionState = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    data?: any;
} | null;
