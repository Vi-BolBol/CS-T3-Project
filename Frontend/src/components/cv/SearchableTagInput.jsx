import { useState, useRef, useEffect } from "react";

function SearchableTagInput({ tags, onChange, suggestions, placeholder = 'Search or type custom...' }){
    const [inputValue, setInputValue] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const wrappedRef = useRef(null)

    const filtered = suggestions.filter(
        (s) =>
            s.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(s)
    )

    useEffect(() => {
        function handleClickOutside(e) {
            if(wrappedRef.current && !wrappedRef.current.contains(e.target)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
    }, [])

    const addTag = (tag) => {
        const trimmed = tag.trim()
        if(trimmed === '' || tags.includes(trimmed)) return
        onChange([...tags, trimmed])
        setInputValue('')
        setIsOpen(false)
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            if(filtered.length > 0){
                addTag(filtered[0])
            } else {
                addTag(inputValue)
            }
        }
    }

    const handleRemove = (tagToRemove) => {
        onChange(tags.filter((t) => t !== tagToRemove))
    }

    return (
        <div
        className="flex flex-col gap-2" ref={wrappedRef}>
            <div
            className="relative">
                <input 
                type="text" 
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-raised border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
                {isOpen && inputValue.length > 0 && (
                    <div
                    className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-raised border border-line rounded-lg shadow-lg custom-scrollbar">
                        {filtered.length > 0 ? (
                            filtered.map((suggestion) => (
                                <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="w-full text-left px-3 py-2 text-sm text-content hover:bg-muted transition"
                                >
                                    {suggestion}
                                </button>
                            ))
                        ) : (
                            <button
                            type="button"
                            onClick={() => addTag(inputValue)}
                            className="w-full teext-left px-3 py-2 text-sm text-accent hover:bg-muted transition"
                            >
                                + Add "{inputValue}" as custom
                            </button>
                        )
                    }
                    </div>
                )}
            </div>

            {tags.length > 0 && (
                <div
                className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                        key={tag}
                        className="flex items-center gap-1 bg-accent/20 text-accent text-sm px-3 py-2 rounded-full border border-accent/30">
                            {tag}
                            <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="text-accent hover:text-red-400 transition ml-1"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchableTagInput