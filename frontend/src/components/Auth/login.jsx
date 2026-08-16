import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
      }

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Unable to login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0e4a67] font-sans">
      <div className="w-full max-w-[480px] bg-white rounded-[1.5rem] p-10 shadow-2xl flex flex-col items-center">
        
        {/* Chikitsha OS Icon Logo */}
        <div className="inline-flex p-3 rounded-xl bg-[#007a78] text-white mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h1.5m0 0l2-4 3 8 4-11 2.5 7h1.5"
            />
          </svg>
        </div>

        {/* Branding Headings */}
        <div className="mb-8 text-center w-full">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            CHIKITSA OS
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Identity Field Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Employee ID / Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all"
              placeholder="admin@chikitsa.com"
              required
            />
          </div>

          {/* Secure Credential Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#007a78]/20 focus:border-[#007a78] transition-all tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Secure Submission Button Trigger */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#007a78] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#006361] transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <span>Secure Login</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;