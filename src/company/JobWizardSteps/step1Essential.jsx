import React, { useState } from 'react';
import { isBlank } from '../../utils/validators';

const DEPARTMENTS = ["Engineering & Infrastructure", "Product & Design", "Data Science & AI"];
const WORK_TYPES = ["On-site", "Hybrid", "Remote"];

function getErrors(data) {
  const errors = {};
  if (isBlank(data.title)) errors.title = 'Job title is required.';
  if (isBlank(data.department)) errors.department = 'Please select a department.';
  if (isBlank(data.description)) {
    errors.description = 'Job description is required.';
  } else if (data.description.trim().length < 20) {
    errors.description = 'Description should be at least 20 characters.';
  }
  return errors;
}

export default function Step1Essential({ data, onChange, onNext, onCancel }) {
  const [touched, setTouched] = useState({});
  const errors = getErrors(data);
  const isValid = Object.keys(errors).length === 0;

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleNext = () => {
    setTouched({ title: true, department: true, description: true });
    if (isValid) onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/5 bg-[#111B34]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">

      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">Job Essentials</h2>
          <p className="text-xs text-gray-400 mt-1">Start by providing the core identifiers of this open tracking position.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Job Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              onBlur={() => markTouched('title')}
              placeholder="e.g. Software Engineering Intern"
              className={`w-full px-4 py-3 rounded-xl border bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition ${
                touched.title && errors.title ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
              }`}
            />
            {touched.title && errors.title && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Department</label>
              <select
                value={data.department}
                onChange={(e) => onChange('department', e.target.value)}
                onBlur={() => markTouched('department')}
                className={`w-full px-4 py-3 rounded-xl border bg-[#070B19]/60 text-sm text-gray-300 focus:outline-none transition ${
                  touched.department && errors.department ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
                }`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {touched.department && errors.department && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Work Arrangement</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#070B19]/60 rounded-xl border border-white/5">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange('workEnvironment', type)}
                    className={`py-2 text-xs font-medium rounded-lg transition ${data.workEnvironment === type ? 'bg-emerald-500 text-[#070B19] font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Job Description</label>
            <textarea
              rows={5}
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              onBlur={() => markTouched('description')}
              placeholder="Describe the tasks, requirements, and tech stack options..."
              className={`w-full px-4 py-3 rounded-xl border bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none transition resize-none ${
                touched.description && errors.description ? 'border-rose-500/40 focus:border-rose-500/40' : 'border-white/5 focus:border-emerald-500/40'
              }`}
            />
            {touched.description && errors.description && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Navigation Foot Actions */}
      <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition">
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B19] hover:bg-emerald-400 transition flex items-center gap-1 shadow-lg shadow-emerald-500/10"
        >
          Next Step <span>-&gt;</span>
        </button>
      </div>

    </div>
  );
}