import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SocratesHQ | Career Intervention Platform",
    description: "Elite career pathways and mentorship for global success.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${geistMono.variable} antialiased dark`}
        >
            <body className="flex flex-col font-sans bg-background text-foreground">
                {children}
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
