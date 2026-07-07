import { useState } from 'react';
import Button from '../../../components/ui/Button';

function CVForm({ onDataChange, onSave }) {
  const [localData, setLocalData] = useState({
    firstName: '',
    lastName: '',
    biography: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localData, [name]: value };
    setLocalData(updated);
    onDataChange(updated); // Live updates the preview panel sheet
  };

  return (
    <div className="space-y-6 bg-[#111c44] p-6 rounded-2xl border border-slate-800">
      <h3 className="text-lg font-bold text-[#10b981]">Create CV Workspace</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">First Name</label>
          <input
            type="text"
            name="firstName"
            value={localData.firstName}
            onChange={handleChange}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#10b981]"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={localData.lastName}
            onChange={handleChange}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#10b981]"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Professional Bio</label>
          <textarea
            name="biography"
            rows="5"
            value={localData.biography}
            onChange={handleChange}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#10b981] resize-none"
          />
        </div>
      </div>

      <Button onClick={() => onSave(localData)} variant="primary" className="w-full mt-4">
        Save CV Progress
      </Button>
    </div>
  );
}

export default CVForm;