import React from 'react';

export default function Step5Checkout({ onSubmit, onBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      <div className="text-center pb-6 border-b border-white/5 mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          Stage 5 of 5
        </span>
        <h2 className="text-2xl font-black text-white mt-3">Finalize Internship Posting</h2>
        <p className="text-xs text-gray-400 mt-1">Review your summary package specifics and choose a visibility framework before deployment.</p>
      </div>

      <div className="space-y-5">
        {/* Package Recap Blueprint Summary Item */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#070B19]/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-300">INTERNSHIP SUMMARY</span>
            <span className="text-emerald-400 cursor-pointer hover:underline">Edit</span>
          </div>
          <p className="text-sm font-bold text-white mt-1.5">Frontend Developer Intern</p>
          <p className="text-xs text-gray-400 mt-0.5">San Francisco, CA - Full-time - $5k-$6k/mo</p>
        </div>

        {/* Plan Select Choice Toggles */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Visibility Plan</label>
          <div className="grid gap-3">
            <div className="p-4 rounded-xl border border-white/5 bg-[#070B19]/20 flex items-start gap-3 cursor-pointer hover:border-white/10">
              <input type="radio" name="plan" id="plan-standard" className="mt-1 accent-emerald-500" />
              <label htmlFor="plan-standard" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Standard Listing</span>
                  <span className="text-gray-400">$29</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Basic publication appearing in structural index feeds for 30 days.</p>
              </label>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#111B34]/60 flex items-start gap-3 cursor-pointer shadow-md shadow-emerald-950/10">
              <input type="radio" name="plan" id="plan-featured" defaultChecked className="mt-1 accent-emerald-500" />
              <label htmlFor="plan-featured" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Featured Listing (Highly Recommended)</span>
                  <span>$129</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-0.5">Top positioning in search feeds, newsletter inclusions, and optimized platform indexing.</p>
              </label>
            </div>
          </div>
        </div>

        {/* Secure Form Payment Input Elements */}
        <div className="border-t border-white/5 pt-4 space-y-3.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Payment Details</label>
          
          <div>
            <input 
              type="text" 
              placeholder="Cardholder Name" 
              className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div>
            <input 
              type="text" 
              placeholder="Card Number (0000 0000 0000 0000)" 
              className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text" 
              placeholder="MM / YY" 
              className="px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40 text-center"
            />
            <input 
              type="text" 
              placeholder="CVC" 
              className="px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40 text-center"
            />
          </div>
        </div>

        {/* Price Output Aggregation Block */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Due</span>
            <span className="text-2xl font-black text-emerald-400">$129.00</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:bg-white/5 transition">
              Back
            </button>
            <button onClick={onSubmit} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">
              Publish Internship
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
