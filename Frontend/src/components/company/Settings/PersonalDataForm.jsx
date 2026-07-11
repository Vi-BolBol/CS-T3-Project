import React from 'react';

export default function PersonalDataForm() {
  return (
    <div className="space-y-6">
      
      {/* Structural Headers */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-content">Personal Data</h2>
        <p className="text-xs text-subtle mt-1">Manage your corporate identity settings, contact channels, and core brand information.</p>
      </div>

      {/* Corporate Profile Image File Upload Handler Structure */}
      <div className="p-4 rounded-2xl border border-white/5 bg-surface/40 flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-accent/20 to-teal-500/20 border border-accent/30 flex items-center justify-center font-black text-accent text-sm shadow-md">
          NG
        </div>
        <div>
          <div className="text-xs font-bold text-content">Company Brand Identity</div>
          <p className="text-[11px] text-subtle mt-0.5">PNG, JPG or SVG formats up to 4MB.</p>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" className="px-2.5 py-1 rounded bg-accent text-[#070B19] font-bold text-[10px] hover:bg-accent transition">
              Upload New
            </button>
            <button type="button" className="px-2.5 py-1 rounded border border-white/10 text-subtle text-[10px] hover:text-content hover:bg-raised/5 transition">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Main Core Form Inputs */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-subtle uppercase tracking-wide mb-1.5">Legal Representative Name</label>
            <input 
              type="text" 
              defaultValue="Jane Doe" 
              className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-surface/60 text-xs text-content focus:outline-none focus:border-accent/40 transition"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-subtle uppercase tracking-wide mb-1.5">Primary Email Address</label>
            <input 
              type="email" 
              defaultValue="admin@nexusgenesis.corp" 
              className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-surface/60 text-xs text-content focus:outline-none focus:border-accent/40 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-subtle uppercase tracking-wide mb-1.5">Business Contact Number</label>
          <input 
            type="text" 
            defaultValue="+1 (555) 124-9832" 
            className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-surface/60 text-xs text-content focus:outline-none focus:border-accent/40 transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-subtle uppercase tracking-wide mb-1.5">Company Biography</label>
          <textarea 
            rows={4}
            defaultValue="NexusGenesis is a tech innovator building next-generation B2B architectures and enterprise data structures. Our engineering teams prioritize fast iteration loops and open source workflows." 
            className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-surface/60 text-xs text-content focus:outline-none focus:border-accent/40 transition resize-none leading-relaxed"
          />
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-subtle hover:text-content transition">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold bg-accent text-[#070B19] hover:bg-accent transition shadow-lg shadow-accent/10">
            Save Changes
          </button>
        </div>
      </form>

    </div>
  );
}