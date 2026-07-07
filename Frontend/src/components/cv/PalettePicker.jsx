function PalettePicker({ palettes, activePalette, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {palettes.map((palette) => (
        <button
          key={palette.name}
          type="button"
          onClick={() => onChange(palette)}
          title={palette.name}
          className={`relative w-8 h-8 rounded-full border-2 transition ${
            activePalette.name === palette.name
              ? 'border-white scale-110'
              : 'border-transparent hover:scale-105'
          }`}
          style={{ background: palette.primary }}
        >
          {activePalette.name === palette.name && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: palette.dark }}>
              ✓
            </span>
          )}
        </button>
      ))}
      {/* Active palette name */}
      <div className="w-full mt-1">
        <span className="text-xs text-slate-400">{activePalette.name}</span>
      </div>
    </div>
  );
}

export default PalettePicker;