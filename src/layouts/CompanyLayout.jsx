import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function CompanyLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-[#070B19] antialiased">
      {/* Platform Level Global Shell Header Navigation */}
      <Header />

      {/* Dynamic Route Content Layout Wrapper */}
      <div className="flex-1 w-full relative">
        {/* Background Visual Artifact Glow System */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/[0.02] blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-10 h-96 w-96 rounded-full bg-teal-500/[0.01] blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* Platform Level Global Shell Footer Summary */}
      <Footer />
    </div>
  );
}