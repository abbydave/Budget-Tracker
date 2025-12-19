"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const isValidEmail = (email: any) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Save token to localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          })
        );
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Sign in to your dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] hover:bg-[#6366F1] text-white py-2 rounded-lg transition disabled:opacity-50 font-medium"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-[#7C3AED] hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#7C3AED] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
