"use client";

import React from "react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in seconds with secure authentication. Your data is encrypted and protected.",
    },
    {
      number: "02",
      title: "Add Your Transactions",
      description:
        "Quickly log income and expenses. Categorize them automatically or manually.",
    },
    {
      number: "03",
      title: "Set Your Budgets",
      description:
        "Define monthly spending limits for each category based on your goals.",
    },
    {
      number: "04",
      title: "Track & Optimize",
      description:
        "Watch your progress in real-time. Get insights and adjust your spending habits.",
    },
  ];

  return (
    <section id="how-it-works" className="py-15 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1F2937] rounded-full border border-gray-700 mb-6">
            <span className="text-[#7C3AED] text-sm font-semibold">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Started in
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#22D3EE]">
              {" "}
              4 Simple Steps
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-[#7C3AED] to-transparent -translate-x-4"></div>
              )}
              <div className="bg-[#1F2937] rounded-xl p-8 border border-gray-700 hover:border-[#7C3AED] transition-all">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#7C3AED] to-[#22D3EE] mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[#94A3B8]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
