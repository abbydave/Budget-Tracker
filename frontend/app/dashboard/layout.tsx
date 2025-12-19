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
    <div style={{ display: "flex", minHeight: "100vh", gap: 24, overflow: "hidden" }}>
      <aside
        style={{
          width: 260,
          flex: "0 0 260px",
          minWidth: 200,
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          boxSizing: "border-box",
        }}
      >
        <SideBar />
      </aside>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <header style={{ padding: "18px 20px 0 20px", boxSizing: "border-box" }}>
          <NavBar />
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div className="container">{children}</div>
        </main>
      </div>
    </div>
  );
}
