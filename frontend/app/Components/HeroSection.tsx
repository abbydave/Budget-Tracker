"use client";

import React from "react";
import { TrendingUp, DollarSign, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1F2937] rounded-full border border-gray-700">
              <span className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse"></span>
              <span className="text-[#E2E8F0] text-sm">
                Smart Financial Management
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Take Control of Your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#22D3EE]">
                Money. Instantly
              </span>
            </h1>

            <p className="text-[#94A3B8] text-lg leading-relaxed">
              Smart tools to track expenses, set budgets, and visualize your
              finances. Get real-time insights and stay on top of your financial
              goals effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-linear-to-r from-[#7C3AED] to-[#6366F1] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#7C3AED]/50 transition-all flex items-center justify-center space-x-2">
                <span>Start Budgeting Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-[#1F2937] text-white rounded-lg font-semibold border border-gray-700 hover:border-[#7C3AED] transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-[#94A3B8] text-sm">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">$2M+</div>
                <div className="text-[#94A3B8] text-sm">Tracked Monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-[#94A3B8] text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-[#7C3AED] to-[#22D3EE] rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-[#1F2937] rounded-2xl p-6 border border-gray-700 shadow-2xl">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#E2E8F0] font-semibold">
                    Monthly Overview
                  </span>
                  <span className="text-[#22D3EE] text-sm">December 2024</span>
                </div>

                {/* Chart Area */}
                <div className="bg-[#111827] rounded-xl p-4 h-48 flex items-end justify-around space-x-2">
                  {[65, 45, 80, 55, 70, 85, 60].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-linear-to-t from-[#7C3AED] to-[#22D3EE] rounded-t-lg"
                      style={{ height: `${height}%` }}></div>
                  ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111827] rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
                      <span className="text-[#94A3B8] text-sm">Income</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$5,420</div>
                    <div className="text-[#22D3EE] text-xs">+12.5%</div>
                  </div>
                  <div className="bg-[#111827] rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-[#94A3B8] text-sm">Expenses</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$3,280</div>
                    <div className="text-red-400 text-xs">-8.2%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
