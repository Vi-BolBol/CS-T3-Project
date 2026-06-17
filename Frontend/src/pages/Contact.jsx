import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting secure helpdesk payload:", formData);
    alert("Message transmitted successfully!");
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      
    <Header />

      {/* Main Structural Wrapper - Compressed to standard configuration form dimensions */}
      <main className="flex-1 w-full mx-auto max-w-xl px-4 py-12 flex flex-col justify-center relative">
        {/* Subtle background ambient vector artifact matching global dark aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />

        <div className="rounded-2xl border border-white/5 bg-[#111B34]/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md relative z-10">
          
          {/* Header Typography Group */}
          <div className="text-center pb-4 border-b border-white/5 mb-6">
            <h1 className="text-lg font-black tracking-tight text-white">Get in Touch</h1>
            <p className="text-xs text-gray-400 mt-1">Have operational questions or portal feedback? Open a connection grid directly with our desk.</p>
          </div>

          {/* Quick Connect Metadata Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-6">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#070B19]/40 p-3">
              <span className="text-sm bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 p-1.5 rounded-lg shrink-0">✉</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Email Desk</span>
                <span className="text-xs text-gray-300 font-medium">support@internfinder.com</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#070B19]/40 p-3">
              <span className="text-sm bg-teal-500/5 text-teal-300 border border-teal-500/10 p-1.5 rounded-lg shrink-0">🌐</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Office Hours</span>
                <span className="text-xs text-gray-300 font-medium">Mon - Fri, 9AM - 5PM</span>
              </div>
            </div>
          </div>

          {/* Separation Accent Rule */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/[0.05]"></div>
            </div>
            <span className="relative bg-[#121c36] px-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
              Send an Encrypted Message
            </span>
          </div>

          {/* Interactive Helpdesk Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input 
                label="Your Name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                required
              />
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="user@gmail.com" 
                value={formData.email}
                onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                required
              />
            </div>

            <Input 
              label="Subject Pipeline" 
              placeholder="How can we assist your infrastructure query?" 
              value={formData.subject}
              onChange={e => setFormData(prev => ({...prev, subject: e.target.value}))}
              required
            />

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Message Content
              </label>
              <textarea 
                rows={4}
                placeholder="Type your contextual request data here..."
                value={formData.message}
                onChange={e => setFormData(prev => ({...prev, message: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full py-2.5">
                Transmit Communications Protocol
              </Button>
            </div>
          </form>

          {/* Fallback Return Anchor */}
          <p className="mt-6 text-center text-[11px] text-gray-500">
            Never mind, drop this stack.{" "}
            <Link to="/" className="font-bold text-emerald-400 hover:underline">
              Back to Home Node
            </Link>
          </p>

        </div>
      </main>

      {/* Global Bottom Shell Alignment Block */}
      <footer className="w-full border-t border-white/5 bg-[#070B19] py-4 text-center text-[10px] text-gray-600 font-mono">
        Environment: Helpdesk Core v1.0.4 // SE-Asia Node
      </footer>
      
    </div>
  );
}
