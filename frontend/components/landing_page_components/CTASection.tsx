"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-linear-to-r from-[#7C3AED] to-[#6366F1] rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their money
              smarter with FinanceFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-[#7C3AED] rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent text-white rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
