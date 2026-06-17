import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Header from "../../components/layout/Header";

export default function Signup() {
  const [role, setRole] = useState("student"); // "student" | "company"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = (e) => {
    e.preventDefault();
    const runtimePayload = { ...formData, accountRole: role };
    console.log("Transmitting operational enrollment data packet:", runtimePayload);
    alert(`Account registration initiated for role: ${role.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      {/* Platform Level Global Shell Header Navigation */}
      <Header />

      {/* Main Structural Wrapper - Aligned exactly with Login node spatial properties */}
      <main className="flex-1 w-full mx-auto max-w-md px-4 py-8 flex flex-col justify-center relative">
        {/* Subtle background ambient vector artifact matching global dark aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />

        <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md relative z-10">
          
          {/* Header Typography Group */}
          <div className="text-center pb-4 border-b border-white/5 mb-5">
            <h1 className="text-lg font-black tracking-tight text-white">Create Account</h1>
            <p className="text-xs text-gray-400 mt-1">Deploy an orchestration workspace to baseline your career vectoring paths.</p>
          </div>

          {/* Core Auth Navigation Toggle Deck */}
          <div className="flex rounded-xl bg-[#070B19]/60 p-1 border border-white/5 text-xs mb-4">
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

          {/* Interactive User Role Selection Matrix */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#070B19]/30 rounded-xl border border-white/[0.02] mb-5">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                role === "student"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner"
                  : "text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              🎓 Student 
            </button>
            <button
              type="button"
              onClick={() => setRole("company")}
              className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                role === "company"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner"
                  : "text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              🏢 Company
            </button>
          </div>

          {/* Secure Onboarding Sign-Up Form Form */}
          <form className="space-y-4" onSubmit={handleSignup}>
            <Input 
              label="Full Name Reference" 
              type="text" 
              placeholder={role === "student" ? "e.g. Kitchok" : "e.g. Nexus Corp"} 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input 
              label="Routing Email Address" 
              type="email" 
              placeholder={role === "student" ? "student@gmail.com" : "hr@company.com"} 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <Input 
              label="Secure Authorization Password" 
              type="password" 
              placeholder="••••••••••••" 
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-2.5">
                Provision New Account ({role === "student" ? "Student" : "Enterprise"})
              </Button>
            </div>
          </form>

          {/* Alternative OAuth Divider Accent */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/[0.05]"></div>
            </div>
            <span className="relative bg-[#121c36] px-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
              Federated Identity
            </span>
          </div>

          {/* Micro OAuth Control Layout */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert(`Federating ${role} account baseline via Google Cloud.`)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white hover:border-white/10 transition duration-150"
            >
              <span><i class="bi bi-google"></i></span> Google
            </button>
            <button
              type="button"
              onClick={() => alert(`Federating ${role} account baseline via GitHub systems.`)}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white hover:border-white/10 transition duration-150"
            >
              <span><i class="bi bi-github"></i></span> GitHub
            </button>
          </div>

          {/* Structural Redirection Link */}
          <p className="mt-6 text-center text-[11px] text-gray-500">
            Already have an infrastructure account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:underline">
              Access account node
            </Link>
          </p>

        </div>
      </main>

      {/* Embedded footer signature matching standard dashboard frames */}
      <footer className="w-full border-t border-white/5 bg-[#070B19] py-3 text-center text-[10px] text-gray-600 font-mono">
        Auth Provisioning Hub v1.2.0 // Secured Framework
      </footer>
    </div>
  );
}