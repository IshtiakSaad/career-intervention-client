"use server";

import { cookies } from "next/headers";

export async function setFirebaseSessionAction(email: string, name: string, role: string) {
    const cookieStore = await cookies();
    
    // Set a simple JSON cookie with user info
    // In a real app, this would be an ID token verified on the server
    const sessionData = JSON.stringify({ email, name, role });
    
    cookieStore.set("firebase-session", sessionData, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // Also set a dummy accessToken to satisfy existing middleware/proxy logic if needed
    cookieStore.set("accessToken", "firebase-dummy-token", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearFirebaseSessionAction() {
    const cookieStore = await cookies();
    cookieStore.set("firebase-session", "", { maxAge: 0 });
    cookieStore.set("accessToken", "", { maxAge: 0 });
}
