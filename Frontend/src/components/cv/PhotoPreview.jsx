function PhotoPreview({ photo }){
    if(!photo){
        return(
            <div
            className="w-40 h-40 rounded-full bg-raised border-2 border-line flex items-center justify-center">
                <span
                className="text-xs text-faint text-center px-4">
                    No Photo Yet
                </span>
            </div>
        )
    }

    return(
        <img
        src={photo}
        alt="CV preview"
        className="w-40 h-40 rounded-full object-cover border-2 border-accent"/>
    )
}

export default PhotoPreview