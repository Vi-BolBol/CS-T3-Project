import { useState } from "react";

function TagInput({ tags, onChange, placeholder = 'Type and press Enter...' }) {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter'){
            e.preventDefault()
            const trimmed = inputValue.trim()
            if(trimmed === '') return
            if(tags.includes(trimmed)) return
            onChange([...tags, trimmed])
            setInputValue('')
        }
    }

    const handleRemove = (tagToRemove) => {
        onChange(tags.filter((tag) => tag !== tagToRemove))
    }

    return(
        <div
        className="flex flex-col gap-2">
            <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-raised border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"  
            />
            {tags.length > 0 && (
                <div
                className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                        key={tag}
                        className="flex items-center gap-1 bg-muted text-content text-xs px-3 py-1 rounded-full"
                        >
                            {tag}
                            <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="text-subtle hover:text-red-400 transition ml-1"
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

export default TagInput