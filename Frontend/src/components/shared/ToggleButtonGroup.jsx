function ToggleButtonGroup({ options, active, onChange }){
    return(
        <div
        className="flex gap-2 bg-raised p-1 rounded-lg">
            {options.map((option) => (
                <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`
                px-4 py-1.5 text-sm font-medium rounded-md transition
                ${
                active === option.value
                ? 'bg-accent text-accent-ink'
                : 'text-subtle hover:text-whtie'
                }
                `}>
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export default ToggleButtonGroup