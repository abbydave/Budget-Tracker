"use client";

import React from "react";
import { Eye, Target, PieChart, Bell, Calendar, Download } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Track Every Dollar",
      description:
        "Automatically categorize every transaction. See where your money goes in real-time with intelligent tracking.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Monthly Budgets",
      description:
        "Set budgets for different categories. Get alerts when approaching limits to stay on track with your goals.",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Insights",
      description:
        "Beautiful charts and graphs that make understanding your finances simple. Spot trends at a glance.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Budget Alerts",
      description:
        "Real-time notifications when you're approaching budget limits. Never overspend again.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Date Range Filtering",
      description:
        "Analyze your spending patterns across any time period. Compare months, quarters, or custom ranges.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export to CSV",
      description:
        "Download your financial data anytime. Perfect for taxes, accountants, or personal records.",
    },
  ];

  return (
    <section id="features" className="py-5 px-6 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1F2937] rounded-full border border-gray-700 mb-6">
            <span className="text-[#7C3AED] text-sm font-semibold">
              FEATURES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#22D3EE]">
              Master Your Finances
            </span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Powerful features designed to give you complete control over your
            money
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-[#1F2937] rounded-xl p-8 border border-gray-700 hover:border-[#7C3AED] transition-all hover:shadow-lg hover:shadow-[#7C3AED]/20">
              <div className="w-14 h-14 bg-linear-to-br from-[#7C3AED] to-[#6366F1] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-[#94A3B8] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
