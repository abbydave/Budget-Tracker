import React from "react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import FeaturesSection from "../Components/FeaturesSection";
import HowItWorksSection from "../Components/HowItWorksSection";
import PricingSection from "../Components/PricingSection";
import CTASection from "../Components/CTASection";
import Footer from "../Components/Footer";

function Landingpage() {
  return (
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
  );
}

export default Landingpage;
