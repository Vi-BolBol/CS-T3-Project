import React, { useState } from 'react';
import TagInput from '../ui/TagInput';
import EditableListInput from '../ui/EditableListInput';

function getErrors(data) {
  const errors = {};
  if (data.skills.length === 0) errors.skills = 'Add at least one required skill.';
  if (data.responsibilities.length === 0) errors.responsibilities = 'Add at least one responsibility.';
  return errors;
}

export default function Step2Detail({ data, onChange, onNext, onBack }) {
  const [touched, setTouched] = useState({});
  const errors = getErrors(data);
  const isValid = Object.keys(errors).length === 0;

  const handleNext = () => {
    setTouched({ skills: true, responsibilities: true });
    if (isValid) onNext();
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-line bg-raised p-6 sm:p-8 shadow-2xl backdrop-blur-md">

      <div className="mb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          Stage 2 of 5
        </span>
        <h2 className="text-xl font-bold tracking-tight text-content mt-4">Role Details</h2>
        <p className="text-xs text-subtle mt-1">Define skills, responsibilities, and candidate expectations.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle mb-2">Required Skills</label>
          <TagInput
            tags={data.skills}
            onChange={(tags) => onChange('skills', tags)}
            placeholder="Type a skill (e.g. React) and press Enter"
          />
          {touched.skills && errors.skills && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.skills}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-subtle mb-2">Responsibilities</label>
          <EditableListInput
            items={data.responsibilities}
            onChange={(items) => onChange('responsibilities', items)}
            placeholder="Type a responsibility and press Enter or Add"
          />
          {touched.responsibilities && errors.responsibilities && <p className="text-[10px] text-rose-400 mt-1.5 font-medium">{errors.responsibilities}</p>}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-line flex items-center justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-line text-subtle hover:text-content hover:bg-raised/5 transition">Back</button>
        <button onClick={handleNext} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent text-accent-ink hover:bg-accent transition shadow-lg shadow-accent/10">Next Step</button>
      </div>
    </div>
  );
}