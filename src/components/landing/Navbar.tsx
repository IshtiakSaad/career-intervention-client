"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import {
    Menu,
    X,
    ChevronDown,
    LogOut,
    LayoutDashboard,
    PlusCircle,
    Settings,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { logoutUserAction } from "@/services/auth/action";

import { useAuth } from "@/components/providers/AuthProvider";
import { clearFirebaseSessionAction } from "@/services/auth/firebase-session";

type NavUser = {
    name: string;
    email: string;
    role: string;
    dashboardUrl: string;
} | null;

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/items" },
    { label: "About", href: "/about" },
    { label: "Consultation", href: "/consultation" },
];


export function Navbar({ user: initialUser = null }: { user?: NavUser }) {
    const { user: firebaseUser, logout: firebaseLogout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Build the user object from firebase user or initial server user
    const activeUser: NavUser = firebaseUser ? {
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
        email: firebaseUser.email || "",
        role: firebaseUser.email === "imsaad.xyz@gmail.com" ? "ADMIN" : "USER",
        dashboardUrl: "/dashboard"
    } : initialUser;


    /* ── Scroll detection ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Close dropdown on outside click ── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        toast.loading("Logging out…", { id: "logout" });
        startTransition(async () => {
            try {
                // Clear firebase session cookies
                await clearFirebaseSessionAction();
                
                if (firebaseUser) {
                    await firebaseLogout();
                } else {
                    await logoutUserAction();
                }
                toast.success("Logged out.", { id: "logout" });
            } catch (err) {
                toast.error("Logout failed.", { id: "logout" });
            }
        });
    };


    const user = activeUser;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-[#050505]/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-black text-primary-foreground group-hover:rotate-12 transition-transform">
                        S
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase italic">
                        Socrates<span className="text-primary">HQ</span>
                    </span>
                </Link>

                {/* ── Desktop Links ── */}
                <div className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* ── Desktop Auth ── */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 px-4 py-2 border border-white/10 hover:bg-white/5 transition-all group"
                            >
                                <div className="w-6 h-6 bg-primary/20 flex items-center justify-center rounded-sm text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    {(user.name || user.email || "?").charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[100px]">
                                    {user.name || user.email}
                                </span>
                                <ChevronDown
                                    className={`w-3 h-3 transition-transform duration-300 ${
                                        dropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 shadow-2xl transition-all duration-300 origin-top-right z-50 ${
                                    dropdownOpen
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                }`}
                            >
                                <div className="px-4 py-3 border-b border-white/[0.06]">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                                        Signed in as
                                    </p>
                                    <p className="text-sm font-medium text-foreground truncate mt-0.5">
                                        {user.name}
                                    </p>
                                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                                        {user.role}
                                    </span>
                                </div>

                                <div className="p-1">
                                    <Link
                                        href={user.dashboardUrl}
                                        className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-all"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        Dashboard
                                    </Link>
                                    
                                    {user.role === "ADMIN" && (
                                        <>
                                            <Link
                                                href="/items/add"
                                                className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-all"
                                            >
                                                <PlusCircle className="w-3.5 h-3.5" />
                                                Add Item
                                            </Link>
                                            <Link
                                                href="/items/manage"
                                                className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-all"
                                            >
                                                <Settings className="w-3.5 h-3.5" />
                                                Manage Items
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        disabled={isPending}
                                        className="flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all w-full text-left disabled:opacity-50"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <LogOut className="w-3.5 h-3.5" />
                                        )}
                                        {isPending ? "Logging out…" : "Log Out"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-sm hover:brightness-110 transition-all active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* ── Mobile Toggle ── */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileOpen && (
                <div className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-5 space-y-1 animate-in slide-in-from-top-4 duration-300">
                    {NAV_LINKS.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2.5"
                            onClick={() => setMobileOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <div className="border-t border-white/[0.06] pt-4 mt-2 space-y-2">
                        {user ? (
                            <>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Signed in as{" "}
                                    <span className="text-foreground font-medium">{user.email}</span>
                                </p>
                                <Link
                                    href={user.dashboardUrl}
                                    className="block text-sm text-muted-foreground hover:text-foreground py-1.5"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/items/add"
                                    className="block text-sm text-muted-foreground hover:text-foreground py-1.5"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Add Item
                                </Link>
                                <Link
                                    href="/items/manage"
                                    className="block text-sm text-muted-foreground hover:text-foreground py-1.5"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Manage Items
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    disabled={isPending}
                                    className="text-sm text-red-400 py-1.5 disabled:opacity-50"
                                >
                                    {isPending ? "Logging out…" : "Log Out"}
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    className="flex-1 text-center text-sm font-medium text-muted-foreground border border-white/[0.08] py-2.5 rounded-sm hover:text-foreground transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 text-center text-sm font-semibold bg-primary text-primary-foreground py-2.5 rounded-sm"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
