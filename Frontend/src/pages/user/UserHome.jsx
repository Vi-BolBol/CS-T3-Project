import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/user/home' },
    { label: 'CV', path: '/cv' },
    { label: 'Applications', path: '/user/applications' },
  ];

  return (
    <div className="min-h-screen bg-[#070B19]">
      <Navbar />
      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[#070B19] mt-[60px] to-[#11182c] border border-slate-800/80 rounded-3xl p-10 lg:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Find the team where you <span className="text-[#10b981] bg-clip-text">belong</span>.
          </h1>
          <p className="text-slate-400 text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
            Connect your developer profile with leading technology environments looking for software engineering placement candidates.
          </p>
          <div className="pt-4">
            <button className="px-8 py-3.5 bg-[#10b981] hover:bg-emerald-600 transition-all font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 active:scale-95">
              Explore Available Roles
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131c35] border border-slate-800/50 p-8 rounded-2xl space-y-3">
            <div className="text-2xl">💼</div>
            <h3 className="font-bold text-base text-white">Curated Technical Matches</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              System filters align automatically with your language preferences and runtime expertise.
            </p>
          </div>
          <div className="bg-[#131c35] border border-slate-800/50 p-8 rounded-2xl space-y-3">
            <div className="text-2xl">🚀</div>
            <h3 className="font-bold text-base text-white">Direct Application Piping</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bypass long recruitment loops by feeding parsed JSON templates straight into engineering teams.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}