import React from "react";
import Navbar from "@/components/landing_page_components/Navbar";
import HeroSection from "@/components/landing_page_components/HeroSection";
import FeaturesSection from "@/components/landing_page_components/FeaturesSection";
import HowItWorksSection from "@/components/landing_page_components/HowItWorksSection";
import PricingSection from "@/components/landing_page_components/PricingSection";
import CTASection from "@/components/landing_page_components/CTASection";
import Footer from "@/components/landing_page_components/Footer";


export default function Home() {
  return (
    <>
      <div className="min-h-screen ">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
    </>
  );
}




