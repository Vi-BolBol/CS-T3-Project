import React, { useState } from 'react';
import FormInput from '../../ui/FormInput';
import TagInput from '../../ui/TagInput';
import EditableListInput from '../../ui/EditableListInput';
import useCompanyJobs from '../../../../hooks/useCompanyJobs';
import { toEditFormData, toUpdatePayload } from '../../../../utils/internshipMapper';

const DEPARTMENTS = ['Engineering & Infrastructure', 'Product & Design', 'Data Science & AI'];
const WORK_TYPES = ['On-site', 'Hybrid', 'Remote'];
const DURATION_UNITS = ['Weeks', 'Months', 'Years'];

export default function EditTab({ job, onSaved }) {
  const { updateInternship, loading } = useCompanyJobs();
  const [formData, setFormData] = useState(() => toEditFormData(job));
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setStatus(null);
    const result = await updateInternship(job.id, toUpdatePayload(formData));
    if (result.success) {
      setStatus({ type: 'success', message: 'Changes saved.' });
      onSaved?.();
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="space-y-5">
      <FormInput label="Job Title" value={formData.title} onChange={(e) => updateField('title', e.target.value)} />

      <div>
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Department</label>
        <select
          value={formData.department}
          onChange={(e) => updateField('department', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40"
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Work Environment</label>
        <div className="flex gap-2">
          {WORK_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('workEnvironment', type)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                formData.workEnvironment === type
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'border-white/5 bg-[#070B19]/40 text-gray-400 hover:border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <FormInput label="Location" value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. San Francisco, CA" />

      <div>
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Required Skills</label>
        <TagInput tags={formData.skills} onChange={(tags) => updateField('skills', tags)} />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Responsibilities</label>
        <EditableListInput items={formData.responsibilities} onChange={(items) => updateField('responsibilities', items)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormInput label="Min Pay ($/mo)" type="number" value={formData.payMin} onChange={(e) => updateField('payMin', e.target.value)} />
        <FormInput label="Max Pay ($/mo)" type="number" value={formData.payMax} onChange={(e) => updateField('payMax', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormInput label="Duration" type="number" value={formData.durationValue} onChange={(e) => updateField('durationValue', e.target.value)} />
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Duration Unit</label>
          <select
            value={formData.durationUnit}
            onChange={(e) => updateField('durationUnit', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-[#070B19]/60 text-xs text-white focus:outline-none focus:border-emerald-500/40"
          >
            {DURATION_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {status && (
        <p className={`text-xs font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {status.message}
        </p>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10 disabled:opacity-40"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
