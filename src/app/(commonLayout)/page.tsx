import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

/**
 * ELITE LANDING PAGE (ODYSSEY COMPLIANT)
 * Implements all 7 required sections with premium tactical aesthetics.
 * Navbar and Footer are provided by the Root Layout.
 */
export default function HomePage() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <FeaturesSection />
            <CategoriesSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
}


