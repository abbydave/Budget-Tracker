"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const isValidEmail = (email: any) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(
        "OTP sent to your email! Check your inbox to get the code."
      );
      setLoading(false);
      setTimeout(() => {
        setStep("otp");
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length < 1) {
      setError("Please enter the OTP sent to your email");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">
          Reset Password
        </h1>
        <p className="text-center text-gray-400 mb-6">
          {step === "email"
            ? "Enter your email to receive an OTP"
            : "Enter the OTP and your new password"}
        </p>

        {/* Step 1: Request OTP */}
        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6366F1] text-white py-2 rounded-lg transition disabled:opacity-50 font-medium"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Reset Password with OTP */}
        {step === "otp" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6366F1] text-white py-2 rounded-lg transition disabled:opacity-50 font-medium"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-sm text-[#7C3AED] hover:underline py-2"
            >
              Back to Email
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-[#7C3AED] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}