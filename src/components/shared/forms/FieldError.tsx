import React from "react";

interface FieldErrorProps {
    errors?: Record<string, string[] | undefined> | null;
    name: string;
}

/**
 * A reusable component to display validation errors for a specific field.
 * Design matches the premium, high-contrast dashboard aesthetic.
 */
export const FieldError = ({ errors, name }: FieldErrorProps) => {
    const errorMessages = errors?.[name];

    if (!errorMessages || errorMessages.length === 0) return null;

    return (
        <div className="mt-1">
            {errorMessages.map((msg, idx) => (
                <p 
                    key={`${name}-error-${idx}`}
                    className="text-[10px] text-destructive uppercase tracking-tighter font-bold animate-in fade-in slide-in-from-top-1 duration-300"
                >
                    {msg}
                </p>
            ))}
        </div>
    );
};
