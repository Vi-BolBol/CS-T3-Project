import React from 'react';

export default function Step2Detail({ onNext, onBack }) {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          Stage 2 of 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white mt-4">Role Details</h2>
        <p className="text-xs text-gray-400 mt-1">Define skills, responsibilities, and candidate expectations.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Required Skills</label>
          <input type="text" placeholder="React, Node.js, Figma, research..." className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Responsibilities</label>
          <textarea rows={5} placeholder="List the core responsibilities for this internship." className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition resize-none" />
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition">Back</button>
        <button onClick={onNext} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">Next Step</button>
      </div>
    </div>
  );
}
