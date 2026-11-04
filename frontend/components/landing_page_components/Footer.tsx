"use client";

import React from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";

const linkClass = "text-[#94A3B8] hover:text-white transition-colors text-sm";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-[#7C3AED] to-[#6366F1] rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-xl font-bold">FinanceFlow</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-sm">
              Smart financial management for everyone. Track, budget, and grow
              your wealth.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className={linkClass}>
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={linkClass}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className={linkClass}>
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className={linkClass}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className={linkClass}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#94A3B8] text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FinanceFlow. A demo project.
          </p>
          <a
            href="https://github.com/abbydave/Budget-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FinanceFlow source code on GitHub"
            className="text-[#94A3B8] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
