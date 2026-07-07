import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

export default function CompanyHome() {
  const featuredPartners = ['Notion', 'Figma', 'Vercel', 'Linear'];
  const talentPool = [
    { name: 'Elena Rodriguez', role: 'Senior Full-Stack Engineer Intern', tags: ['React', 'Node.js', 'AWS'], initial: 'ER' },
    { name: 'Marcus Dow', role: 'UX/UI Design Fellow', tags: ['Figma', 'Prototyping', 'Research'], initial: 'MD' }
  ];

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <section className="text-center max-w-3xl mx-auto py-10">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            Discover Top-Tier <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Powerhouses
            </span>
          </h1>
          <p className="mt-4 text-sm text-gray-400 sm:text-base max-w-xl mx-auto">
            Connect with exceptional talent and innovative partnerships to fuel your next big project on Cambodia's premium virtual internship hub.
          </p>

          <div className="mt-8 max-w-xl mx-auto relative group">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 group-hover:opacity-30 transition blur duration-300" />
            <div className="relative flex items-center rounded-full bg-[#111B34] border border-white/10 p-1.5 pl-5">
              <span className="text-gray-400 text-xs font-semibold">Search</span>
              <input
                type="text"
                placeholder="Search candidates, roles, skills..."
                className="w-full bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none pl-2.5"
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-[#070B19] font-bold text-xs px-6 py-2 rounded-full transition shrink-0 shadow-md">
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-white/5 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Featured Partners</h2>
            <span className="text-xs text-emerald-400 cursor-pointer hover:underline">View All -&gt;</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredPartners.map((partner) => (
              <div
                key={partner}
                className="border border-white/5 bg-[#111B34]/30 rounded-xl p-5 text-center flex flex-col items-center justify-center hover:border-white/10 transition group"
              >
                <div className="h-8 w-8 rounded bg-white/5 mb-2 group-hover:scale-105 transition flex items-center justify-center text-xs font-mono font-bold text-gray-400">
                  {partner[0]}
                </div>
                <span className="text-xs font-medium text-gray-300">{partner}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-white/5 pt-10">
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Top Talent Pool</h2>
            <p className="text-xs text-gray-400 mt-0.5">Early-access candidate tracks ready for immediate structural placement</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {talentPool.map((talent) => (
              <div key={talent.name} className="border border-white/5 bg-[#111B34]/40 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                        {talent.initial}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{talent.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{talent.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-300 px-2 py-0.5 rounded">Top Talent</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {talent.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-[#070B19]/60 border border-white/5 text-gray-400 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-gray-300 hover:bg-white/5 transition">
                    View Profile
                  </button>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/5">
                    Know More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
