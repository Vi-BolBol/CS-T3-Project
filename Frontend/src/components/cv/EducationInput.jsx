import { useState } from 'react';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const emptyEntry = {
  institution: '',
  degree: '',
  startYear: '',
  endYear: '',
  currentlyStudying: false,
  gpa: '',
  hideGpa: false,
};

function EducationInput({ entries, onChange }) {
  const [form, setForm] = useState(emptyEntry);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (form.institution.trim() === '' || form.degree.trim() === '') return;
    if (form.gpa !== '' && parseFloat(form.gpa) > 4.0) return;

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

      {/* Form / button — on top */}
      {isAdding ? (
        <div className="bg-raised border border-line rounded-lg p-4 flex flex-col gap-3">

          <div>
            <label className="block text-xs text-subtle mb-1">
              Institution Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="e.g. Cambodia Academy of Digital Technology"
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs text-subtle mb-1">
              Degree / Programme <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.degree}
              onChange={(e) => handleChange('degree', e.target.value)}
              placeholder="e.g. B.Sc. Computer Science"
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Start Year */}
          <div>
            <label className="block text-xs text-subtle mb-1">Start Year</label>
            <select
              value={form.startYear}
              onChange={(e) => handleChange('startYear', e.target.value)}
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* End Year */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-subtle">End Year</label>
              <label className="flex items-center gap-1.5 text-xs text-subtle cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.currentlyStudying}
                  onChange={(e) => handleChange('currentlyStudying', e.target.checked)}
                  className="accent-[rgb(var(--c-accent))]"
                />
                Currently studying here
              </label>
            </div>
            {!form.currentlyStudying && (
              <select
                value={form.endYear}
                onChange={(e) => handleChange('endYear', e.target.value)}
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
          </div>

          {/* GPA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-subtle">
                GPA
                <span className="text-faint ml-1">(optional)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-subtle cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hideGpa}
                  onChange={(e) => {
                    handleChange('hideGpa', e.target.checked);
                    if (e.target.checked) handleChange('gpa', '');
                  }}
                  className="accent-[rgb(var(--c-accent))]"
                />
                Prefer not to disclose
              </label>
            </div>

            {!form.hideGpa ? (
              <>
                <input
                  type="text"
                  value={form.gpa}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^(\d*\.?\d{0,2})$/.test(val)) return;
                    if (val === '') { handleChange('gpa', val); return; }
                    if (parseFloat(val) > 4.0) return;
                    handleChange('gpa', val);
                  }}
                  onKeyDown={(e) => {
                    const allowedKeys = [
                      'Backspace', 'Delete', 'Tab',
                      'ArrowLeft', 'ArrowRight', 'Home', 'End'
                    ];
                    if (allowedKeys.includes(e.key)) return;
                    if (e.key === '.') {
                      if (form.gpa.includes('.')) e.preventDefault();
                      return;
                    }
                    if (!/^\d$/.test(e.key)) e.preventDefault();
                    const dotIndex = form.gpa.indexOf('.')
                    if(dotIndex !== -1 && form.gpa.length - dotIndex > 2) e.preventDefault()
                  }}
                  placeholder="e.g. 3.7"
                  className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
                {form.gpa !== '' && parseFloat(form.gpa) > 4.0 && (
                  <p className="text-xs text-red-400 mt-1">GPA must be between 0.0 and 4.0</p>
                )}
              </>
            ) : (
              <div className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm text-faint italic">
                Not disclosed
              </div>
            )}
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
              disabled={form.institution.trim() === '' || form.degree.trim() === ''}
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
          + Add Education
        </button>
      )}

      {/* Added entries — below */}
      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="bg-raised border border-line rounded-lg px-4 py-3 flex justify-between items-start gap-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-content">{entry.institution}</span>
                <span className="text-xs text-accent">{entry.degree}</span>
                <span className="text-xs text-subtle">
                  {entry.startYear} —{' '}
                  {entry.currentlyStudying ? 'Present' : entry.endYear}
                </span>
                {entry.hideGpa ? (
                  <span className="text-xs text-faint italic">GPA: Not disclosed</span>
                ) : entry.gpa ? (
                  <span className="text-xs text-subtle">GPA: {entry.gpa}</span>
                ) : null}
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

export default EducationInput;