import React, { useState } from 'react';

function TagInput({ tags, onChange, placeholder = 'Type and press Enter...' }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed === '') return;
      if (tags.includes(trimmed)) { setInputValue(''); return; }
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-[#070B19]/60 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/40 transition"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 bg-emerald-400/10 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-400/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="text-emerald-400/70 hover:text-rose-400 transition leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;