import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Header from "../../components/layout/Header";
import { registerUser } from "../../api/authApi";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
        return;
      }

      const res = await registerUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "company"
        ? { companyName: formData.name }
        : { fullName: formData.name }),
      });

      if (res.success) {
        // Match token initialization from the login side
        if (res.token) localStorage.setItem("token", res.token);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

        if (formData.role === "company") {
          navigate("/company/home");
        } else {
          navigate("/user/home");
        }
        return;
      }

      setError(res.message || "Account creation failed.");
    } catch (err) {
      setError("Unexpected network fault while constructing account infrastructure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      {/* Platform Level Global Shell Header Navigation */}
      <Header />

      {/* Main Structural Wrapper */}
      <main className="flex-1 w-full mx-auto max-w-md px-4 py-8 flex flex-col justify-center relative">
        {/* Subtle background ambient vector artifact matching global dark aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />

        <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md relative z-10">
          
          {/* Header Typography Group */}
          <div className="text-center pb-4 border-b border-white/5 mb-5">
            <h1 className="text-lg font-black tracking-tight text-white">Create Infrastructure Account</h1>
            <p className="text-xs text-gray-400 mt-1">Register your node credentials to spin up a fresh secure workspace.</p>
          </div>

          {/* Core Auth Toggle Deck */}
          <div className="flex rounded-xl bg-[#070B19]/60 p-1 border border-white/5 text-xs mb-5">
            <Link
              to="/login"
              className="flex-1 rounded-lg px-3 py-2 text-center font-semibold text-gray-400 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-center font-bold text-[#070B19] shadow-md shadow-emerald-500/10"
            >
              Sign Up
            </Link>
          </div>

          {/* Interactive Form Matrix */}
          <form className="space-y-4" onSubmit={handleSignup}>
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="user@gmail.com" 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••••••" 
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />

            {/* Custom Styled Role Picker */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Account Architecture Role
              </label>
              <div className="relative">
                <select 
                  value={formData.role} 
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full appearance-none rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/50 transition duration-150 cursor-pointer"
                >
                  <option value="student" className="bg-[#070B19] text-white">Student / Regular User</option>
                  <option value="company" className="bg-[#070B19] text-white">Company Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message Layout Display */}
            {error && (
              <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 font-medium transition duration-150">
                ⚠️ {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-2.5" disabled={loading}>
                {loading ? "Initializing Account..." : "Create Account Infrastructure"}
              </Button>
            </div>
          </form>

          {/* Alternative OAuth Divider Accent */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/[0.05]"></div>
            </div>
            <span className="relative bg-[#121c36] px-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
              Third Party Node
            </span>
          </div>

          {/* Micro OAuth Control Layout */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert("OAuth handshake initializing via Google server nodes.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white hover:border-white/10 transition duration-150"
            >
              <span><i className="bi bi-google"></i></span> Google
            </button>
            <button
              type="button"
              onClick={() => alert("OAuth handshake initializing via GitHub repositories.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white hover:border-white/10 transition duration-150"
            >
              <span><i className="bi bi-github"></i></span> GitHub
            </button>
          </div>

          {/* Structural Redirection Link */}
          <p className="mt-6 text-center text-[11px] text-gray-500">
            Already have an active workspace account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </main>

      {/* Embedded footer signature matching standard dashboard frames */}
      <footer className="w-full border-t border-white/5 bg-[#070B19] py-3 text-center text-[10px] text-gray-600 font-mono">
        Auth Node v1.2.0 // Secured Framework
      </footer>
    </div>
  );
}