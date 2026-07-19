import Cropper from 'react-easy-crop'

function PhotoEditor({ photo, crop, zoom, onCropChange, onZoomChange, onCropComplete }){
    return(
        <div
        className='relative w-64 h-64 bg-raised rounded-lg overflow-hidden'>
            <Cropper
            image={photo}
            crop={crop}
            minZoom={1}
            maxZoom={3}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            zoomWithScroll={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            // style={{
            //     cropAreaStyle: {
            //         border: '2px solid #34D399',
            //         boxShadow: 'none', // removes the default dark overlay shadow trick the library uses
            //     },
            // }}
            />
        </div>
    )
}

export default PhotoEditor