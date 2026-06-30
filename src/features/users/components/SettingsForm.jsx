import { useState } from 'react';

export default function SettingsForm({ initialProfile, onSave, isUpdating }) {
  const [formData, setFormData] = useState(initialProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-6 text-left" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Username Handle</label>
          <input 
            type="text" 
            name="username"
            value={formData.username} 
            onChange={handleChange}
            className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Target Role</label>
          <input 
            type="text" 
            name="role"
            value={formData.role} 
            onChange={handleChange}
            className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Bio Paragraph</label>
        <textarea 
          name="bio"
          value={formData.bio} 
          onChange={handleChange}
          rows={4}
          className="w-full bg-[#0b1224] border border-slate-700/60 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10b981] transition-all resize-none" 
        />
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-slate-800/60">
        <button 
          type="submit" 
          disabled={isUpdating}
          className="px-6 py-3 bg-[#10b981] hover:bg-emerald-600 active:scale-95 disabled:opacity-50 transition-all rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-950/20"
        >
          {isUpdating ? 'Saving Profile...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}