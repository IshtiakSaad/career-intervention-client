"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";


import { AuthProvider } from "@/components/providers/AuthProvider";

type ProvidersProps = {
    children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            {children}
            <Toaster richColors position="top-center" />
        </AuthProvider>
    );

}