"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/dashboard_components/NavBar";
import SideBar from "@/components/dashboard_components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Protect dashboard - redirect if no token
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    // small delay to avoid flicker
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "4px solid rgba(124,58,237,0.9)",
              borderTop: "4px solid transparent",
              margin: "0 auto",
              animation: "spin .9s linear infinite",
            }}
          />
          <p style={{ color: "rgba(230,238,248,0.8)", marginTop: 12 }}>Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden text-[#FFFFFF]">
      
      <div className=" bg-[#1E1F23] text-[#9CA3AF] h-15  border-b-[#6366F1]">
        <NavBar />
      </div>

      <div className="flex flex-col md:flex-row w-full grow h-0">
        
        <div className=" flex-none md:block md:w-66 bg-[#111827]">
          <SideBar />
        </div>
  
        <div className="bg-[#111827] flex-1 md:overflow-y-auto px-4 md:px-7.5 py-4 h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
