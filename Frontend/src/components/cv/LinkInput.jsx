import { useState } from 'react';

const MAX_LINKS = 5;

const LINK_SUGGESTIONS = [
  { label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
  { label: 'GitHub', placeholder: 'https://github.com/username' },
  { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { label: 'Telegram', placeholder: 'https://t.me/username' },
];

function LinkInput({ links, onChange }) {
  const [labelInput, setLabelInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleSuggestionClick = (suggestion) => {
    setLabelInput(suggestion.label);
    setUrlInput('');
    setSelectedSuggestion(suggestion);
  };

  const handleAdd = () => {
    const trimmedLabel = labelInput.trim();
    const trimmedUrl = urlInput.trim();
    if (trimmedLabel === '' || trimmedUrl === '') return;
    if (links.length >= MAX_LINKS) return;
    onChange([...links, { label: trimmedLabel, url: trimmedUrl }]);
    setLabelInput('');
    setUrlInput('');
    setSelectedSuggestion(null);
  };

  const handleRemove = (index) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Quick suggestion buttons */}
      <div className="flex flex-wrap gap-2">
        {LINK_SUGGESTIONS.map((suggestion) => {
          const alreadyAdded = links.some(
            (l) => l.label.toLowerCase() === suggestion.label.toLowerCase()
          );
          return (
            <button
              key={suggestion.label}
              type="button"
              disabled={alreadyAdded || links.length >= MAX_LINKS}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                selectedSuggestion?.label === suggestion.label
                  ? 'bg-accent/20 text-accent border-accent/30'
                  : alreadyAdded || links.length >= MAX_LINKS
                  ? 'text-faint border-line cursor-not-allowed'
                  : 'text-subtle border-line hover:border-accent hover:text-accent'
              }`}
            >
              {suggestion.label}
            </button>
          );
        })}
      </div>

      {/* Input area */}
      {links.length < MAX_LINKS && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={labelInput}
            onChange={(e) => {
              setLabelInput(e.target.value);
              setSelectedSuggestion(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Label (e.g. Portfolio, GitHub...)"
            className="w-full bg-raised border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedSuggestion
                  ? selectedSuggestion.placeholder
                  : 'https://...'
              }
              className="flex-1 bg-raised border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={labelInput.trim() === '' || urlInput.trim() === ''}
              className="px-4 py-2 bg-accent text-accent-ink text-sm font-semibold rounded-lg hover:bg-accent transition disabled:bg-muted disabled:text-subtle disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Max reached message */}
      {links.length >= MAX_LINKS && (
        <p className="text-xs text-yellow-400">
          Maximum of {MAX_LINKS} links reached. Remove one to add another.
        </p>
      )}

      {/* Added links */}
      {links.length > 0 && (
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-raised border border-line rounded-lg px-3 py-2 gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-accent font-medium bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {link.label}
                </span>
                <a                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-subtle hover:text-accent truncate transition"
                >
                  {link.url}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-subtle hover:text-red-400 transition text-sm shrink-0"
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

export default LinkInput;