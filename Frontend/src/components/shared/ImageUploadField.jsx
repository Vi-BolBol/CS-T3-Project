import { useRef, useState } from 'react';

/*
  Picture upload for a profile or company logo.

  There is no file-storage service in this project, so the image is read in the
  browser and stored as a base64 data URL on the profile row — the same approach
  the CV builder already uses for its photo. That keeps the whole feature inside
  the existing profile endpoints with no new infrastructure.

  Two guards matter:
    - a size cap, because an unresized phone photo is several megabytes and would
      bloat every API response that returns the profile
    - downscaling before encoding, so a large image becomes a small square rather
      than being rejected outright
*/

const MAX_BYTES = 5 * 1024 * 1024;   // 5 MB before downscaling
const MAX_DIM = 512;                 // avatars are never shown larger than this

/** Downscales to a square and re-encodes as JPEG to keep the payload small. */
function downscale(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a readable image.'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const size = Math.min(side, MAX_DIM);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadField({
  value,
  onChange,
  label = 'Picture',
  shape = 'circle',           // 'circle' for people, 'rounded' for companies
  fallback = '?',
  hint,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';                  // let the same file be re-picked
    if (!file) return;

    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('That image is larger than 5 MB. Please choose a smaller one.');
      return;
    }

    setBusy(true);
    try {
      onChange(await downscale(file));
    } catch (err) {
      setError(err.message || 'Could not process that image.');
    } finally {
      setBusy(false);
    }
  };

  const round = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-subtle">{label}</label>

      <div className="flex items-center gap-4">
        {value ? (
          <img
            src={value}
            alt=""
            className={`h-20 w-20 flex-shrink-0 border border-line object-cover ${round}`}
          />
        ) : (
          <span
            className={`grid h-20 w-20 flex-shrink-0 place-items-center border border-line bg-accent-soft text-xl font-black text-accent ${round}`}
          >
            {String(fallback).charAt(0).toUpperCase()}
          </span>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-content disabled:opacity-50"
            >
              {busy ? 'Processing…' : value ? 'Change' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                disabled={busy}
                onClick={() => { setError(''); onChange(null); }}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-danger disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>

          <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
            {hint || 'JPG or PNG, up to 5 MB. Cropped to a square automatically.'}
          </p>
          {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={pick}
        className="hidden"
      />
    </div>
  );
}
