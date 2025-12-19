"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/dashboard_components/NavBar";
import SideBar from "@/components/dashboard_components/SideBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Protect dashboard - redirect if no token
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-900">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <NavBar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
