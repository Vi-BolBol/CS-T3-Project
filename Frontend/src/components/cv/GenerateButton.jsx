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
        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
        : 'bg-emerald-400 text-slate-900 hover:bg-emerald-300' 
        }
        `}>
            {label}
        </button>
    )
}

export default GenerateButton