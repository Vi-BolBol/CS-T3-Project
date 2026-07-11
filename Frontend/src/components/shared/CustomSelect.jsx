import { useState, useRef, useEffect } from "react";

function CustomSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [triggerWidth, setTriggerWidth] = useState(0)
  const dropdownRef = useRef(null)
  const measureRef = useRef(null)

  const selectedOption = options.find((opt) => String(opt.value) === String(value))
  const displayText = selectedOption ? selectedOption.label : placeholder

  // Find longest label among options and placeholder
  const longestLabel = [placeholder, ...options.map(o => o.label)]
    .reduce((a, b) => a.length >= b.length ? a : b, '')

  // Measure the longest label's pixel width
  useEffect(() => {
    if (measureRef.current) {
      setTriggerWidth(measureRef.current.offsetWidth + 12)
    }
  }, [longestLabel])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef} style={{ width: triggerWidth || 'auto' }}>

      {/* Hidden span to measure longest label */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap px-3 py-2 text-sm pointer-events-none"
        style={{ left: -9999 }}
      >
        {longestLabel}
        <span className="ml-2">▾</span>
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-raised border border-line rounded-lg px-3 py-2 text-sm text-left w-full flex items-center justify-between gap-2 focus:outline-none focus:border-accent"
      >
        <span className={`${selectedOption ? 'text-content' : 'text-faint'} whitespace-nowrap`}>
          {displayText}
        </span>
        <span className={`text-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto overflow-x-hidden bg-raised border border-line rounded-lg shadow-lg custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-3 py-2 text-sm transition ${
                String(option.value) === String(value)
                  ? 'bg-accent text-accent-ink'
                  : 'text-content hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect