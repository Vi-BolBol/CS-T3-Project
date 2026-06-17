import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Header from "../../components/layout/Header";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log("Transmitting identity vector verification:", credentials);
    alert("Authentication validation processed.");
  };

  return (
      <div className="min-h-screen overflow-y-scroll bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      {/* Platform Level Global Shell Header Navigation */}
      <Header />

      {/* Main Structural Wrapper - Eliminates the awkward gap while centering the portal panel */}
      <main className="flex-1 w-full mx-auto max-w-md px-4 py-8 flex flex-col justify-center relative">
        {/* Subtle background ambient vector artifact matching global dark aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />

        <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md relative z-10">
          
          {/* Header Typography Group */}
          <div className="text-center pb-4 border-b border-white/5 mb-5">
            <h1 className="text-lg font-black tracking-tight text-white">Welcome Back</h1>
            <p className="text-xs text-gray-400 mt-1">Sign in to initialize secure operations across your dashboard workspace.</p>
          </div>

          {/* Core Auth Toggle Deck */}
          <div className="flex rounded-xl bg-[#070B19]/60 p-1 border border-white/5 text-xs mb-5">
            <Link
              to="/login"
              className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-center font-bold text-[#070B19] shadow-md shadow-emerald-500/10"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="flex-1 rounded-lg px-3 py-2 text-center font-semibold text-gray-400 transition hover:text-white"
            >
              Sign Up
            </Link>
          </div>

          {/* Interactive Form Matrix */}
          <form className="space-y-4" onSubmit={handleSignIn}>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="user@gmail.com" 
              value={credentials.email}
              onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => alert("Password reset route protocol active.")} 
                  className="text-[10px] text-emerald-400 font-bold hover:underline focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••••••" 
                value={credentials.password}
                onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-2.5">
                Sign In to Platform
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
              <span><i class="bi bi-google"></i></span> Google
            </button>
            <button
              type="button"
              onClick={() => alert("OAuth handshake initializing via GitHub repositories.")}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#070B19]/50 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/[0.02] hover:text-white hover:border-white/10 transition duration-150"
            >
              <span><i class="bi bi-github"></i></span> GitHub
            </button>
          </div>

          {/* Structural Redirection Link */}
          <p className="mt-6 text-center text-[11px] text-gray-500">
            Don't have an infrastructure account?{" "}
            <Link to="/signup" className="font-bold text-emerald-400 hover:underline">
              Create an account
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