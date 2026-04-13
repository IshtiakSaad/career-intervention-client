import React from "react";

interface ManagementHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode; 
}

export const ManagementHeader = ({ title, description, children }: ManagementHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
                {children}
            </div>
        </div>
    );
};
