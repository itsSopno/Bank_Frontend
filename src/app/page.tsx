import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SecuritySection from "@/components/landing/SecuritySection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0F]">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <SecuritySection />
      <PricingSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
