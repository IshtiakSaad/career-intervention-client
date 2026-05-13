import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

/**
 * Common Layout — wraps all public-facing pages (landing, items, about, auth, etc.)
 * with the site-wide Navbar and Footer.
 * 
 * Dashboard pages use their own (dashboardLayout) with sidebar navigation,
 * so they are NOT wrapped by this layout.
 */
export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="flex-1 mt-20">{children}</main>
            <Footer />
        </>
    );
}
