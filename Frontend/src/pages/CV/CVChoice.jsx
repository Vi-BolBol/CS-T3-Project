import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/shared/Toast.jsx';
import { parseUploadedCV } from '../../api/cvApi.js';

function CVChoice() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleUploadClick = () => {
    if (isParsing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setToastMessage('Please upload a PDF file.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setToastMessage('File is too large — max 15MB.');
      return;
    }

    setIsParsing(true);
    try {
      const base64File = await readFileAsBase64(file);
      const parsed = await parseUploadedCV(base64File);
      console.log('PARSED CV:', parsed);
      navigate('/cv/upload-review', { state: { parsed } });
    } catch (err) {
      setToastMessage(typeof err === 'string' ? err : 'Failed to read your CV. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleStartBuilder = () => {
    navigate('/cv/step1');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-16 px-4">
      <div className="text-center max-w-2xl mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Prepare Your Application</h1>
        <p className="text-slate-400 text-lg">
          Choose how you want to present yourself to top companies. Upload an
          existing CV or build one tailored for tech roles.
        </p>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-6 lg:gap-4">
        {/* Upload CV — calm, muted */}
        <button
          onClick={handleUploadClick}
          disabled={isParsing}
          className="group flex-1 w-full h-full border-2 border-dashed border-slate-600 rounded-2xl px-8 py-14 flex flex-col items-center text-center bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-full bg-slate-700/60 flex items-center justify-center mb-6">
            {isParsing ? (
              <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-3">Upload CV</h2>
          <p className="text-slate-400 max-w-xs mb-8">
            {isParsing
              ? 'Reading your CV — this takes a few seconds...'
              : "Click to browse for your PDF. We'll automatically parse your details."}
          </p>
          <span className="px-6 py-2.5 bg-emerald-400 text-slate-900 font-semibold rounded-lg group-hover:bg-emerald-300 transition-colors">
            {isParsing ? 'Parsing...' : 'Browse Files'}
          </span>
          <p className="text-xs text-slate-500 tracking-wide mt-6 font-mono">
            SUPPORTED FORMAT: PDF (MAX 15MB)
          </p>
        </button>

        {/* OR divider */}
        <div className="flex lg:flex-col items-center gap-3 lg:gap-0 lg:h-40">
          <div className="hidden lg:block w-px flex-1 bg-slate-700" />
          <span className="text-xs font-mono text-slate-500 border border-slate-700 rounded-full w-9 h-9 flex items-center justify-center bg-slate-900">
            OR
          </span>
          <div className="hidden lg:block w-px flex-1 bg-slate-700" />
        </div>

        {/* Create Online — the lively, "pick me" option */}
        <button
          onClick={handleStartBuilder}
          className="relative flex-1 w-full h-full rounded-2xl px-8 py-14 flex flex-col items-center text-center overflow-hidden
                     bg-linear-to-br from-emerald-500/15 via-slate-800 to-slate-800
                     border-2 border-emerald-400/40 shadow-[0_0_40px_-10px_rgba(52,211,153,0.35)]
                     hover:border-emerald-400 hover:shadow-[0_0_55px_-8px_rgba(52,211,153,0.55)]
                     hover:-translate-y-1 transition-all duration-300"
        >
          <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider text-emerald-300 bg-emerald-400/10 border border-emerald-400/40 rounded-full px-3 py-1">
            RECOMMENDED
          </span>

          <span className="absolute top-8 left-10 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping [animation-duration:2.2s]" />
          <span className="absolute bottom-16 left-16 w-1 h-1 rounded-full bg-emerald-300/80 animate-ping [animation-duration:3s] [animation-delay:0.6s]" />
          <span className="absolute top-20 right-14 w-1 h-1 rounded-full bg-emerald-300/70 animate-ping [animation-duration:2.6s] [animation-delay:1.2s]" />

          <div className="w-16 h-16 rounded-full bg-emerald-400/15 flex items-center justify-center mb-6 animate-pulse [animation-duration:2.5s]">
            <svg className="w-7 h-7 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-3 bg-linear-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
            Create Online
          </h2>
          <p className="text-slate-300 max-w-xs mb-8">
            Build a standardized profile using our guided builder, step by
            step. Best for landing tech roles.
          </p>
          <span className="px-8 py-2.5 bg-emerald-400 text-slate-900 font-bold rounded-lg hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20">
            Start Builder →
          </span>
        </button>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

export default CVChoice;