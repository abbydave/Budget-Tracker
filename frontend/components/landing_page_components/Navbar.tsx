"use client";

import React, { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "../../public/landing_page_images/logo.png";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111827]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href='/' className="flex-shrink-0 flex items-center">
            <Image
              src={logo}
              alt="FinanceFlow Logo"
              className=" w-30 h-full object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-[#7C3AED] transition-colors">
              Login
            </button>
            <button className="px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#7C3AED] transition-all">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a
              href="#home"
              className="block text-[#9CA3AF] hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="block text-[#9CA3AF] hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-[#9CA3AF] hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block text-[#9CA3AF] hover:text-white transition-colors"
            >
              Pricing
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              <button className="px-6 py-2 text-white border border-gray-700 rounded-lg">
                Login
              </button>
              <button className="px-6 py-2 bg-[#6366F1] text-white rounded-lg">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
