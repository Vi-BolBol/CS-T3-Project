import { useState } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const emptyEntry = {
  jobTitle: '',
  company: '',
  location: '',
  startMonth: '',
  startYear: '',
  endMonth: '',
  endYear: '',
  currentlyWorking: false,
  description: '',
};

function WorkExperienceInput({ entries, onChange }) {
  const [form, setForm] = useState(emptyEntry);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding new, number = editing that index

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (form.jobTitle.trim() === '' || form.company.trim() === '') return;

    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = form;
      onChange(updated);
    } else {
      onChange([...entries, form]);
    }

    setForm(emptyEntry);
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleRemove = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setForm(entries[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setForm(emptyEntry);
    setIsAdding(false);
    setEditingIndex(null);
  };

  return (
    <div className="flex flex-col gap-3">

      {isAdding ? (
        <div className="bg-raised border border-line rounded-lg p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-subtle mb-1">Job Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="e.g. Frontend Developer Intern"
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-subtle mb-1">Company <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="e.g. TechCo Cambodia"
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-subtle mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Phnom Penh, Cambodia"
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-subtle mb-1">Start Date</label>
            <div className="flex gap-2">
              <select
                value={form.startMonth}
                onChange={(e) => handleChange('startMonth', e.target.value)}
                className="flex-1 bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={form.startYear}
                onChange={(e) => handleChange('startYear', e.target.value)}
                className="flex-1 bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-subtle">End Date</label>
              <label className="flex items-center gap-1.5 text-xs text-subtle cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.currentlyWorking}
                  onChange={(e) => handleChange('currentlyWorking', e.target.checked)}
                  className="accent-[rgb(var(--c-accent))]"
                />
                Currently working here
              </label>
            </div>
            {!form.currentlyWorking && (
              <div className="flex gap-2">
                <select
                  value={form.endMonth}
                  onChange={(e) => handleChange('endMonth', e.target.value)}
                  className="flex-1 bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={form.endYear}
                  onChange={(e) => handleChange('endYear', e.target.value)}
                  className="flex-1 bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-subtle mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of your responsibilities..."
              rows={3}
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-subtle hover:text-content transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={form.jobTitle.trim() === '' || form.company.trim() === ''}
              className="px-4 py-2 bg-accent text-accent-ink text-sm font-semibold rounded-lg hover:bg-accent transition disabled:bg-muted disabled:text-subtle disabled:cursor-not-allowed"
            >
              {editingIndex !== null ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-2 border border-dashed border-line rounded-lg text-sm text-subtle hover:border-accent hover:text-accent transition"
        >
          + Add Work Experience
        </button>
      )}

      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="bg-raised border border-line rounded-lg px-4 py-3 flex justify-between items-start gap-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-content">{entry.jobTitle}</span>
                <span className="text-xs text-accent">{entry.company}</span>
                {entry.location && (
                  <span className="text-xs text-subtle">📍 {entry.location}</span>
                )}
                <span className="text-xs text-subtle">
                  {entry.currentlyWorking ? 'Present' : `${entry.endMonth} ${entry.endYear}`}
                </span>
                {entry.description && (
                  <p className="text-xs text-subtle mt-1 leading-relaxed">{entry.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="text-subtle hover:text-accent transition text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-subtle hover:text-red-400 transition text-sm"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default WorkExperienceInput;