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
        <div className="mt-1.5 space-y-1">
            {errorMessages.map((msg, idx) => (
                <div 
                    key={`${name}-error-${idx}`}
                    className="flex items-start gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300"
                >
                    <span className="text-[8px] mt-1 text-destructive/60">◆</span>
                    <p className="text-[9px] text-destructive uppercase tracking-wide font-bold leading-tight">
                        {msg}
                    </p>
                </div>
            ))}
        </div>
    );
};
