import React, { useState } from 'react';

/**
 * A controlled list input where each item can be added, edited inline, or removed.
 * `items` is an array of strings.
 */
export default function EditableListInput({ items, onChange, placeholder = 'Type and press Enter or Add...' }) {
  const [draft, setDraft] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  const commitAdd = () => {
    const trimmed = draft.trim();
    if (trimmed === '') return;
    onChange([...items, trimmed]);
    setDraft('');
  };

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitAdd();
    }
  };

  const startEdit = (idx) => {
    setEditingIndex(idx);
    setEditDraft(items[idx]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditDraft('');
  };

  const saveEdit = (idx) => {
    const trimmed = editDraft.trim();
    if (trimmed === '') { cancelEdit(); return; }
    const updated = [...items];
    updated[idx] = trimmed;
    onChange(updated);
    setEditingIndex(null);
    setEditDraft('');
  };

  const handleEditKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit(idx);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleRemove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
    if (editingIndex === idx) cancelEdit();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleAddKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl border border-white/5 bg-[#070B19]/60 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition"
        />
        <button
          type="button"
          onClick={commitAdd}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <ol className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-xs bg-[#070B19]/40 border border-white/5 rounded-lg px-3 py-2.5"
            >
              <span className="text-emerald-400 font-bold shrink-0 mt-0.5">{idx + 1}.</span>

              {editingIndex === idx ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, idx)}
                    className="flex-1 px-2 py-1 rounded-lg border border-emerald-500/40 bg-[#070B19] text-xs text-white focus:outline-none"
                  />
                  <button type="button" onClick={() => saveEdit(idx)} className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px]">
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit} className="text-gray-500 hover:text-gray-300 font-semibold text-[11px]">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-300 leading-relaxed">{item}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(idx)}
                      className="text-gray-500 hover:text-emerald-400 transition text-[11px] font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-gray-500 hover:text-rose-400 transition text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}