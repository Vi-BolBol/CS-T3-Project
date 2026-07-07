import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

export default function CompanyProfile() {
  const techStack = [
    { name: 'Python / PyTorch', level: 'Core' },
    { name: 'React', level: 'High Performance' },
    { name: 'Kubernetes / Docker', level: 'Infrastructure' },
    { name: 'Next.js / TailwindCSS', level: 'Frontend Stack' }
  ];

  const affiliations = [
    { title: 'Stanford AI Lab Partner', year: '2023 - Present', desc: 'Collaborative research initiatives focused on ethical AI deployment and data pipeline models.' },
    { title: 'OpenAI Enterprise Consortium', year: '2025 - Present', desc: 'Founding member pushing standards in infrastructure usage for large-scale enterprise workflows.' }
  ];

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="h-40 rounded-2xl bg-gradient-to-r from-slate-900 to-[#111B34] border border-white/5 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent)]" />
        </div>

        <div className="relative px-4 sm:px-8 pb-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            <div className="h-20 w-20 rounded-2xl bg-[#111B34] border-2 border-[#070B19] flex items-center justify-center font-black text-2xl text-emerald-400 shadow-xl">
              NG
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-white/10 rounded-xl bg-white/5 text-xs font-semibold text-gray-300 hover:bg-white/10 transition">
                Message
              </button>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#070B19] text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-500/10">
                Active Employer
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">NexusGenesis</h1>
            <p className="text-xs text-emerald-400 font-medium mt-0.5">@nexusgenesis - B2B & Enterprise Solutions</p>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-4">
              <span>San Francisco, CA</span>
              <span>www.nexusgenesis.io</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
          <div className="md:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#111B34]/30 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                About Us
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-300">
                NexusGenesis is at the forefront of building next-generation enterprise automation architectures. We focus on creating sustainable, lightweight, and highly reliable models that empower businesses to coordinate complex operations. Our work environments prioritize continuous training frameworks, open-source resource integration, and complete technical visibility.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111B34]/30 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                Our Affiliations
              </h3>

              <div className="space-y-4">
                {affiliations.map((item) => (
                  <div key={item.title} className="p-3.5 rounded-xl border border-white/5 bg-[#070B19]/40 hover:border-white/10 transition">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-emerald-400 font-mono">{item.year}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#111B34]/30 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                Tech Stack
              </h3>
              <div className="space-y-2">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between p-2 rounded-lg bg-[#070B19]/50 border border-white/[0.02]">
                    <span className="text-xs font-medium text-white">{tech.name}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {tech.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111B34]/30 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                Hiring Sectors
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {['Systems Engineering', 'Distributed Databases', 'DevOps & SRE', 'Product Analytics'].map((sector) => (
                  <span key={sector} className="text-[11px] bg-[#070B19]/60 border border-white/5 px-2.5 py-1 rounded-lg text-gray-300 font-medium">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
