import { useState } from 'react';

const emptyEntry = {
  fullName: '',
  jobTitle: '',
  company: '',
  email: '',
  phone: '',
};

function ReferenceInput({ entries, onChange }) {
  const [form, setForm] = useState(emptyEntry);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (form.fullName.trim() === '' || form.company.trim() === '') return;

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-subtle mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Dara Heng"
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-subtle mb-1">
                Company <span className="text-red-400">*</span>
              </label>
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
            <label className="block text-xs text-subtle mb-1">
              Job Title
              <span className="text-faint ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder="e.g. HR Manager"
              className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-subtle mb-1">
                Email
                <span className="text-faint ml-1">(optional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. dara@techco.com"
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-subtle mb-1">
                Phone
                <span className="text-faint ml-1">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +855 12 345 678"
                className="w-full bg-muted border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              />
            </div>
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
              disabled={form.fullName.trim() === '' || form.company.trim() === ''}
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
          + Add Reference
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
                <span className="text-sm font-semibold text-content">{entry.fullName}</span>
                {entry.jobTitle && (
                  <span className="text-xs text-accent">{entry.jobTitle}</span>
                )}
                <span className="text-xs text-subtle">{entry.company}</span>
                {entry.email && (
                  <span className="text-xs text-subtle">✉ {entry.email}</span>
                )}
                {entry.phone && (
                  <span className="text-xs text-subtle">📞 {entry.phone}</span>
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

export default ReferenceInput;