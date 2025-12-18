"use client";

import React from "react";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 50 transactions/month",
        "Basic expense tracking",
        "3 budget categories",
        "Monthly reports",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "For serious budget managers",
      features: [
        "Unlimited transactions",
        "Advanced categorization",
        "Unlimited budget categories",
        "Real-time insights & alerts",
        "CSV export",
        "Priority support",
        "Custom date ranges",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      price: "$29.99",
      description: "For teams and businesses",
      features: [
        "Everything in Pro",
        "Multi-user access",
        "Team collaboration",
        "Advanced analytics",
        "API access",
        "Dedicated support",
        "Custom integrations",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-15 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1F2937] rounded-full border border-gray-700 mb-6">
            <span className="text-[#7C3AED] text-sm font-semibold">
              PRICING
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#22D3EE]">
              {" "}
              Perfect Plan
            </span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Flexible pricing for individuals and teams. Start free, upgrade
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.highlighted
                  ? "bg-linear-to-b from-[#1F2937] to-[#111827] border-[#7C3AED] shadow-lg shadow-[#7C3AED]/20 scale-105"
                  : "bg-[#1F2937] border-gray-700 hover:border-[#7C3AED]"
              }`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-linear-to-r from-[#7C3AED] to-[#6366F1] rounded-full text-white text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#94A3B8] text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-[#94A3B8] ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                    <span className="text-[#E2E8F0]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-linear-to-r from-[#7C3AED] to-[#6366F1] text-white hover:shadow-lg hover:shadow-[#7C3AED]/50"
                    : "bg-[#111827] text-white border border-gray-700 hover:border-[#7C3AED]"
                }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
