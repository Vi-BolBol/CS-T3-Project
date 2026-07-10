import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (role.trim()) params.set('search', role.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/view-detail?${params.toString()}`);
  };

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

          {/* Search Bar — searches real internships from GET /api/internships */}
          <form
            onSubmit={handleSearch}
            className="relative z-10 mx-auto flex max-w-2xl flex-col gap-3 pt-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700/60 bg-[#0B132B]/60 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Role (e.g. UX Designer)"
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700/60 bg-[#0B132B]/60 px-4 py-3">
              <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or Remote"
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#10b981] hover:bg-emerald-600 transition-all font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 active:scale-95 whitespace-nowrap"
            >
              Search
            </button>
          </form>
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
