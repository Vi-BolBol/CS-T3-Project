function TemplatePicker({ templates, activeTemplate, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          className={`flex items-center gap-3 p-2 rounded-lg border transition ${
            activeTemplate === template.id
              ? 'border-emerald-400 bg-emerald-400/10'
              : 'border-slate-600 hover:border-slate-400'
          }`}
        >
          {/* Template thumbnail placeholder */}
          <div
            className={`w-12 h-16 rounded flex-shrink-0 flex items-center justify-center text-xs ${
              activeTemplate === template.id
                ? 'bg-emerald-400/20 text-emerald-400'
                : 'bg-slate-700 text-slate-500'
            }`}
          >
            {template.id === 'classic' && (
              <div className="w-full h-full flex">
                <div className="w-1/3 h-full bg-current opacity-30 rounded-l" />
                <div className="flex-1 p-1 flex flex-col gap-0.5">
                  <div className="h-1 bg-current opacity-40 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                </div>
              </div>
            )}
            {template.id === 'modern' && (
              <div className="w-full h-full p-1 flex flex-col gap-0.5">
                <div className="h-1.5 bg-current opacity-40 rounded" />
                <div className="h-0.5 bg-current opacity-20 rounded" />
                <div className="h-0.5 bg-current opacity-20 rounded" />
                <div className="h-px bg-current opacity-30 rounded mt-0.5" />
                <div className="h-0.5 bg-current opacity-20 rounded" />
                <div className="h-0.5 bg-current opacity-20 rounded" />
              </div>
            )}
            {template.id === 'professional' && (
              <div className="w-full h-full p-1 flex gap-1">
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="h-1 bg-current opacity-40 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="h-1 bg-current opacity-40 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                  <div className="h-0.5 bg-current opacity-20 rounded" />
                </div>
              </div>
            )}
          </div>

          {/* Template info */}
          <div className="flex flex-col items-start gap-0.5">
            <span className={`text-sm font-medium ${
              activeTemplate === template.id ? 'text-emerald-400' : 'text-slate-300'
            }`}>
              {template.name}
            </span>
            <span className="text-xs text-slate-500">
              {template.id === 'classic' && 'Sidebar layout with photo'}
              {template.id === 'modern' && 'Clean single column'}
              {template.id === 'professional' && 'Structured two columns'}
            </span>
          </div>

          {/* Active indicator */}
          {activeTemplate === template.id && (
            <span className="ml-auto text-emerald-400 text-sm">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default TemplatePicker;