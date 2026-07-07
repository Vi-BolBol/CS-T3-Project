function PhotoPreview({ photo }){
    if(!photo){
        return(
            <div
            className="w-40 h-40 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
                <span
                className="text-xs text-slate-500 text-center px-4">
                    No Photo Yet
                </span>
            </div>
        )
    }

    return(
        <img
        src={photo}
        alt="CV preview"
        className="w-40 h-40 rounded-full object-cover border-2 border-emerald-400"/>
    )
}

export default PhotoPreview