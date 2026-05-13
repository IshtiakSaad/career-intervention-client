import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/[0.04] pt-24 pb-12">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="text-xl font-bold tracking-tight mb-6 block">
                            <span className="text-primary">Socrates</span>
                            <span className="text-foreground">HQ</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Elite career intervention platform for the next generation of global leaders. Engineered for precision, performance, and results.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Platform</h4>
                        <ul className="space-y-4">
                            {["Find Mentors", "Specialties", "How it Works", "Pricing"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Company</h4>
                        <ul className="space-y-4">
                            {["About Us", "Our Mission", "Careers", "Contact"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Verification Standards"].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                        © {new Date().getFullYear()} SocratesHQ. All Rights Reserved.
                    </p>
                    <div className="flex gap-8">
                        {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social) => (
                            <Link key={social} href="#" className="text-[10px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.1em] font-bold">
                                {social}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
