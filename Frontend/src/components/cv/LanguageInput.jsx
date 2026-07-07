import { useState, useRef, useEffect } from 'react';

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Intermediate', 'Basic'];

const PROFICIENCY_COLORS = {
  Native: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
  Fluent: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  Intermediate: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  Basic: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
};

const SUGGESTED_LANGUAGES = [
  'Khmer', 'English', 'French', 'Mandarin', 'Japanese',
  'Korean', 'Thai', 'Vietnamese', 'Malay', 'Indonesian',
  'Spanish', 'German', 'Arabic', 'Hindi', 'Portuguese',
  'Italian', 'Russian', 'Burmese', 'Lao', 'Tagalog',
];

function LanguageInput({ languages, onChange }) {
  const [langInput, setLangInput] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('Intermediate');
  const [isOpen, setIsOpen] = useState(false);
  const [openProficiencyFor, setOpenProficiencyFor] = useState(null);
  const wrapperRef = useRef(null);

  // Filter suggestions: match input, exclude already-added languages
  const filtered = SUGGESTED_LANGUAGES.filter(
    (l) =>
      l.toLowerCase().includes(langInput.toLowerCase()) &&
      !languages.some((added) => added.language.toLowerCase() === l.toLowerCase())
  );

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setOpenProficiencyFor(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addLanguage = (name) => {
    const trimmed = name.trim();
    if (trimmed === '') return;
    if (languages.some((l) => l.language.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...languages, { language: trimmed, proficiency: selectedProficiency }]);
    setLangInput('');
    setSelectedProficiency('Intermediate');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0) {
        addLanguage(filtered[0]);
      } else {
        addLanguage(langInput);
      }
    }
  };

  const handleRemove = (langToRemove) => {
    onChange(languages.filter((l) => l.language !== langToRemove));
  };

  const handleChangeProficiency = (langName, newProficiency) => {
    onChange(languages.map((l) =>
      l.language === langName ? { ...l, proficiency: newProficiency } : l
    ));
    setOpenProficiencyFor(null);
  };

  return (
    <div className="flex flex-col gap-3" ref={wrapperRef}>

      {/* Input area */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 flex flex-col gap-2 focus-within:border-emerald-400 relative">
        <input
          type="text"
          value={langInput}
          onChange={(e) => {
            setLangInput(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type a language..."
          className="bg-transparent text-sm outline-none placeholder-slate-500 text-white"
        />

        {/* Proficiency selector + Add button */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {PROFICIENCY_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedProficiency(level)}
                className={`px-2 py-0.5 text-xs rounded-full border transition ${
                  selectedProficiency === level
                    ? PROFICIENCY_COLORS[level]
                    : 'text-slate-500 border-slate-600 hover:border-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              if (filtered.length > 0) {
                addLanguage(filtered[0]);
              } else {
                addLanguage(langInput);
              }
            }}
            className="px-3 py-1 bg-emerald-400 text-slate-900 text-xs font-semibold rounded-lg hover:bg-emerald-300 transition"
          >
            Add
          </button>
        </div>

        {/* Suggestions dropdown */}
        {isOpen && langInput.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-10 max-h-48 overflow-y-auto bg-slate-800 border border-slate-600 rounded-lg shadow-lg custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addLanguage(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition"
                >
                  {suggestion}
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={() => addLanguage(langInput)}
                className="w-full text-left px-3 py-2 text-sm text-emerald-400 hover:bg-slate-700 transition"
              >
                + Add "{langInput}" as custom
              </button>
            )}
          </div>
        )}
      </div>

      {/* Added language tags */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {languages.map((entry) => (
            <div
              key={entry.language}
              className="relative flex items-center gap-1.5 bg-slate-800 border border-slate-600 rounded-full pl-3 pr-1 py-1"
            >
              <span className="text-sm text-white">{entry.language}</span>

              {/* Proficiency badge — clicking opens a dropdown */}
              <button
                type="button"
                onClick={() =>
                  setOpenProficiencyFor(
                    openProficiencyFor === entry.language ? null : entry.language
                  )
                }
                className={`text-xs px-2 py-0.5 rounded-full border transition ${PROFICIENCY_COLORS[entry.proficiency]}`}
              >
                {entry.proficiency} ▾
              </button>

              {/* Proficiency dropdown for this tag */}
              {openProficiencyFor === entry.language && (
                <div className="absolute left-0 top-full mt-1 z-20 bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden">
                  {PROFICIENCY_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleChangeProficiency(entry.language, level)}
                      className={`w-full text-left px-3 py-2 text-xs transition ${
                        level === entry.proficiency
                          ? PROFICIENCY_COLORS[level]
                          : 'text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(entry.language)}
                className="text-slate-400 hover:text-red-400 transition text-sm ml-0.5 w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageInput;