import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Header from "../../components/layout/Header";
import { registerUser } from "../../api/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
    });

    if (result.success) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (result.user.role === "student") {
        navigate('/user/home');
      } else if (result.user.role === "company") {
        navigate('/company/home');
      } else {
        alert("Unknown role");
      }
    } else {
      alert(result.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      <Header />

      <main className="flex-1 w-full mx-auto max-w-md px-4 py-8 flex flex-col justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />

        <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md relative z-10">
          <div className="text-center pb-4 border-b border-white/5 mb-5">
            <h1 className="text-lg font-black tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Create your account as a student or company.
            </p>
          </div>

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
              Student
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
              Company
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <Input
              label="Name"
              type="text"
              placeholder={role === "student" ? "Student name" : "Company name"}
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder={role === "student" ? "student@gmail.com" : "hr@company.com"}
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-2.5">
                Create Account ({role === "student" ? "Student" : "Company"})
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-[11px] text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>

      <footer className="w-full border-t border-white/5 bg-[#070B19] py-3 text-center text-[10px] text-gray-600 font-mono">
        Auth Provisioning Hub v1.2.0
      </footer>
    </div>
  );
}