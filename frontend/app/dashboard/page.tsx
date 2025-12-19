"use client";

import React, { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard-service";
import { budgetService } from "@/services/budget-service";

const DashboardPage = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [summary, setSummary] = useState<any | null>(null);
  const [budget, setBudget] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    if (!currentMonth) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [sumRes, budRes] = await Promise.all([
          dashboardService.getMonthlySummary(currentMonth),
          budgetService.getBudgetByMonth(currentMonth),
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (budRes.success && budRes.data.length) setBudget(budRes.data[0]);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth]);

  const formatCurrency = (n: number) =>
    `₦${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  const handleMonth = (dir: "prev" | "next") => {
    const d = new Date(currentMonth + "-01");
    d.setMonth(d.getMonth() + (dir === "prev" ? -1 : 1));
    setCurrentMonth(d.toISOString().slice(0, 7));
  };

  const budgetPct =
    budget && summary
      ? Math.min(
          (summary.totalExpense || 0) / (budget.limit || 1) * 100,
          100
        )
      : 0;

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <h1 className="h1">Dashboard</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Overview & quick actions
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={() => handleMonth("prev")}
          >
            ←
          </button>
          <div className="kicker">
            {new Date(currentMonth + "-01").toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => handleMonth("next")}
          >
            →
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: "var(--danger)" }}>
          {error}
        </div>
      )}

      <div className="summary-row">
        <div className="summary-item card">
          <div className="kicker">Total Income</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div className="h2" style={{ color: "var(--success)" }}>
              {formatCurrency(summary?.totalIncome || 0)}
            </div>
            <div className="pill muted">Income</div>
          </div>
        </div>

        <div className="summary-item card">
          <div className="kicker">Total Expense</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div className="h2" style={{ color: "var(--danger)" }}>
              {formatCurrency(summary?.totalExpense || 0)}
            </div>
            <div className="pill muted">Expense</div>
          </div>
        </div>

        <div className="summary-item card">
          <div className="kicker">Balance</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div className="h2">{formatCurrency(summary?.balance || 0)}</div>
            <div className="pill muted">Net</div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div className="kicker">Monthly Budget</div>
            <div className="h2" style={{ marginTop: 6 }}>
              {budget ? formatCurrency(budget.limit) : "No budget set"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="muted">
              Spent: {formatCurrency(summary?.totalExpense || 0)}
            </div>
            <div className="muted">
              Remaining:{" "}
              {formatCurrency(
                Math.max(
                  0,
                  (budget?.limit || 0) - (summary?.totalExpense || 0)
                )
              )}
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div className="muted">Progress</div>
            <div className="muted">
              {budget ? `${budgetPct.toFixed(1)}%` : "—"}
            </div>
          </div>
          <div className="progress" aria-hidden>
            <i
              style={{
                width: `${Math.min(budgetPct, 100)}%`,
                background:
                  budgetPct > 100
                    ? "linear-gradient(90deg,#ef4444,#f97316)"
                    : "linear-gradient(90deg,#7C3AED,#6D28D9)",
              }}
            />
          </div>
          {budget && budgetPct > 100 && (
            <div
              className="muted"
              style={{ marginTop: 8, color: "var(--danger)" }}
            >
              Exceeded by{" "}
              {formatCurrency((summary?.totalExpense || 0) - budget.limit)}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="h2">Recent Transactions</h3>
          <div className="table-wrap" style={{ marginTop: 12 }}>
            {/* lightweight table; link to /dashboard/transactions for full view */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  textAlign: "left",
                }}
              >
                <tr>
                  <th style={{ padding: "8px 6px" }}>Date</th>
                  <th style={{ padding: "8px 6px" }}>Category</th>
                  <th style={{ padding: "8px 6px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ padding: "8px 6px" }}
                    colSpan={3}
                    className="muted"
                  >
                    Open Transactions page to view details
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="h2">Quick Actions</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 12,
            }}
          >
            <a className="btn btn-primary" href="/dashboard/transactions">
              Add Transaction
            </a>
            <a className="btn btn-ghost" href="/dashboard/analytics">
              View Analytics
            </a>
            <a className="btn btn-ghost" href="/dashboard/budgets">
              Manage Budget
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;