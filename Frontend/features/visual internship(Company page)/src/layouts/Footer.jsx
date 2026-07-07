import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#070B19] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.02] pb-4 mb-4">
          <div>
            <span className="text-[11px] font-black tracking-wider text-white uppercase block">Internship Finder</span>
            <p className="text-[10px] text-gray-500 mt-0.5">(c) {currentYear} Internship Finder. Built on Transparent Foundations.</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] font-medium text-gray-400">
            <a href="#privacy" className="hover:text-emerald-400 transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-emerald-400 transition">Terms of Service</a>
            <a href="#cookies" className="hover:text-emerald-400 transition">Cookies</a>
            <a href="#support" className="hover:text-emerald-400 transition">Company Support</a>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-gray-600 font-mono">
          <span>Environment: Production v2.4</span>
          <span>Region: SE-Asia Node (Phnom Penh)</span>
        </div>
      </div>
    </footer>
  );
}
