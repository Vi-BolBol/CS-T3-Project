function GenerateButton({ status, onGenerate }){
    const isDisabled = status === 'generating' || status === 'done'

    const label =
    status === 'generating' ? 'Generating...'
    : status === 'done' ? 'Already Generated' :
    'Generate?';

    return(
        <button
        onClick={onGenerate}
        disabled={isDisabled}
        className={`
        px-5 py-2 font-semibold rounded-lg transition
        ${
        isDisabled 
        ? 'bg-muted text-subtle cursor-not-allowed'
        : 'bg-accent text-accent-ink hover:bg-accent' 
        }
        `}>
            {label}
        </button>
    )
}

export default GenerateButton