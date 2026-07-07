import { useRef, useState } from 'react';

function PhotoSourceButtons({ onPhotoSelected, onError }) {
  const fileInputRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPhotoSelected(reader.result);
    reader.readAsDataURL(file);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowWebcam(true);
    } catch (err) {
      console.error('Webcam access denied or unavailable:', err);
      onError?.('Could not access webcam. Please check your browser permissions.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // Draw the video as-is (no flip) — preview is also unmirrored, so WYSIWYG
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/png');
    stopWebcam();
    onPhotoSelected(base64Image);
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowWebcam(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {!showWebcam && (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Upload — calm, muted */}
          <button
            onClick={handleUploadClick}
            className="group relative border-2 border-dashed border-slate-600 rounded-xl px-6 py-6 flex items-center gap-4 text-left bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-11 h-11 shrink-0 rounded-full bg-slate-700/60 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v12" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Upload Photo</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose an existing photo from your device</p>
            </div>
            <span className="text-xs font-semibold text-slate-900 bg-slate-300 group-hover:bg-white rounded-md px-3 py-1.5 transition-colors">
              Browse
            </span>
          </button>

          {/* Take Photo — lively */}
          <button
            onClick={startWebcam}
            className="group relative rounded-xl px-6 py-6 flex items-center gap-4 text-left overflow-hidden
                       bg-gradient-to-br from-emerald-500/15 via-slate-800 to-slate-800
                       border-2 border-emerald-400/40 shadow-[0_0_30px_-10px_rgba(52,211,153,0.35)]
                       hover:border-emerald-400 hover:shadow-[0_0_40px_-8px_rgba(52,211,153,0.55)]
                       transition-all duration-300"
          >
            <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-400/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.25 2.25 0 018.9 4.5h6.2a2.25 2.25 0 012.073 1.675l.283 1.132a1.5 1.5 0 001.456 1.13h.088a2.25 2.25 0 012.25 2.25v9.128a2.25 2.25 0 01-2.25 2.25H4.75A2.25 2.25 0 012.5 19.815V10.688a2.25 2.25 0 012.25-2.25h.088a1.5 1.5 0 001.456-1.13l.283-1.132z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Take Photo</h3>
              <p className="text-xs text-slate-300 mt-0.5">Use your webcam to snap one right now</p>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-emerald-400 group-hover:bg-emerald-300 rounded-md px-3 py-1.5 transition-colors shadow-md shadow-emerald-400/20">
              Open Cam
            </span>
          </button>
        </div>
      )}

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {showWebcam && (
        <div className="flex flex-col items-center gap-3">
          <video
            ref={(el) => {
              videoRef.current = el
              if(el && streamRef.current){
                el.srcObject = streamRef.current
              }
            }}
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }}
            className="w-64 h-64 bg-black rounded-lg object-cover"
          />
          <p className="text-xs text-slate-400">Position yourself and click Capture</p>
          <div className="flex gap-3">
            <button onClick={capturePhoto} className="px-5 py-2 bg-emerald-400 text-slate-900 font-semibold rounded-lg hover:bg-emerald-300 transition">
              Capture
            </button>
            <button onClick={stopWebcam} className="px-5 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoSourceButtons;