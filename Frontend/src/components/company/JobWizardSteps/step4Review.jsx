import React from 'react';

export default function Step4Review({ data, onNext, onBack }) {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">

      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          Stage 4 of 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-white mt-4">Review</h2>
        <p className="text-xs text-gray-400 mt-1">Confirm the posting before checkout.</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#070B19]/50 p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Position</span>
          <span className="font-bold text-white">{data.title || '—'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Department</span>
          <span className="font-bold text-white">{data.department || '—'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Work Type</span>
          <span className="font-bold text-white">{data.workEnvironment || '—'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Duration</span>
          <span className="font-bold text-white">{data.durationValue ? `${data.durationValue} ${data.durationUnit}` : '—'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Pay Range</span>
          <span className="font-bold text-emerald-400">{data.payMin && data.payMax ? `$${data.payMin} - $${data.payMax} / mo` : '—'}</span>
        </div>
      </div>

      {data.description && (
        <div className="mt-4 rounded-xl border border-white/5 bg-[#070B19]/30 p-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Description</span>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{data.description}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/5 bg-[#070B19]/30 p-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Required Skills</span>
          <ul className="mt-2 space-y-1">
            {data.skills.map((skill, idx) => (
              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400">•</span>{skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.responsibilities.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/5 bg-[#070B19]/30 p-4">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Responsibilities</span>
          <ul className="mt-2 space-y-1">
            {data.responsibilities.map((item, idx) => (
              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-emerald-400">•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition">Back</button>
        <button onClick={onNext} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">Continue to Checkout</button>
      </div>
    </div>
  );
}