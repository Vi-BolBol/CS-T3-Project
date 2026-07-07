import { useCallback, useState } from 'react';
import StepProgressBar from '../../components/cv/StepProgressBar.jsx';
import PhotoSourceButtons from '../../components/cv/PhotoSourceButtons.jsx';
import PhotoEditor from '../../components/cv/PhotoEditor.jsx';
import PhotoPreview from '../../components/cv/PhotoPreview.jsx';
import { getCroppedImg } from '../../utils/cropImage.js';
import GenerateButton from '../../components/cv/GenerateButton.jsx';
import { generateCVPhoto } from '../../api/cvApi.js'
import ToggleButtonGroup from '../../components/shared/ToggleButtonGroup.jsx';
import Toast from '../../components/shared/Toast.jsx';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';
import { useNavigate } from 'react-router-dom';
import SuggestionBanner from '../../components/shared/SuggestionBanner.jsx';

function CVStep1Photo() {
  const { cvData, updatePhoto, markStepComplete } = useCVBuilder()
  const navigate = useNavigate()

  // Seed from context so coming back restores the photo
  const [originalPhoto, setOriginalPhoto] = useState(cvData.photo || null);
  const [crop, setCrop] = useState({ x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  // If we already have a saved photo, show it as the preview immediately
  const [croppedPreview, setCroppedPreview] = useState(cvData.photo || null)
  const [aiPhoto, setAiPhoto] = useState(null)
  const [generationStatus, setGenerationStatus] = useState('idle')
  const [activeVersion, setActiveVersion] = useState('original')
  const [toastMessage, setToastMessage] = useState('')
  const [photoError, setPhotoError] = useState(false)

  const displayedPhoto = activeVersion === 'ai' && aiPhoto ? aiPhoto : originalPhoto

  const handleCropComplete = useCallback(async (_, croppedAreaPixels) => {
    if(!displayedPhoto) return
    try {
      const result = await getCroppedImg(displayedPhoto, croppedAreaPixels)
      setCroppedPreview(result)
      // Auto-save the cropped photo to context whenever the crop changes
      updatePhoto(result)
    } catch (e) {
      console.error('Failed to crop image: ', e)
    }
  }, [displayedPhoto, updatePhoto])

  const handleRetake = () => {
    setOriginalPhoto(null);
    setCrop({ x: 0, y: 0})
    setZoom(1)
    setCroppedPreview(null)
    setPhotoError(false)
    setAiPhoto(null)
    setGenerationStatus('idle')
    setActiveVersion('original')
    updatePhoto(null)
  };

  const handleGenerate = async () => {
    if(!originalPhoto || generationStatus !== 'idle') return;

    setGenerationStatus('generating')
    try{
      const result = await generateCVPhoto(originalPhoto)
      setAiPhoto(result)
      setGenerationStatus('done')
    } catch (e) {
      console.error('Generation failed: ', e)
      setGenerationStatus('idle')
      setToastMessage('Photo generation failed. Please try again!')
    }
  }

  const handleNext = () => {
    if(!displayedPhoto){
      setPhotoError(true)
      setToastMessage('You still need a photo before continuing.', )
      return
    }
    updatePhoto(croppedPreview || displayedPhoto)
    markStepComplete(1)
    navigate('/cv/step2')
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-900 text-white flex flex-col items-center py-4 px-4">
      <StepProgressBar currentStep={1} />
      <SuggestionBanner />

      <div className={`w-full max-w-4xl bg-slate-800/60 border rounded-2xl shadow-xl shadow-black/20 p-6 mt-4 flex gap-6 transition-colors ${photoError ? 'border-red-400/70' : 'border-slate-700/80'}`}>
        <div className="flex-1 flex flex-col gap-2 items-center justify-center">
          {!originalPhoto ? (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold">Add Your Photo</h2>
                <p className="text-sm text-slate-400 mt-1">A clear headshot helps your CV stand out.</p>
              </div>
              <PhotoSourceButtons onPhotoSelected={(photo) => { setOriginalPhoto(photo); setPhotoError(false); }} onError={(msg) => setToastMessage(msg)} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <PhotoEditor 
              photo={displayedPhoto}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              />
              <p className='text-xs text-slate-400 text-center max-w-[16rem]'>
                Drag to reposition the photo
              </p>
              <div className="flex items-center gap-3 w-64">
                <span className="text-xs text-slate-400">−</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-emerald-400"
                />
                <span className="text-xs text-slate-400">+</span>
              </div>

              <GenerateButton status={generationStatus} onGenerate={handleGenerate} />
              
              {aiPhoto && (
                <ToggleButtonGroup
                options={[
                  { value: 'original', label: 'Original'},
                  { value: 'ai', label: 'AI Generated'},
                ]}
                active={activeVersion}
                onChange={setActiveVersion}
                />
              )}

              <button
              onClick={handleRetake}
              className="text-sm text-slate-300 hover:text-emerald-400 underline transition">
                Choose a different photo
              </button>
            </div>
          )}
        </div>

        <div className="w-px bg-slate-700" />
          <div className="flex flex-col items-center justify-center gap-3 self-center">
            <div className={`rounded-full transition-shadow ${photoError ? 'ring-2 ring-red-400/70' : ''}`}>
              <PhotoPreview photo={croppedPreview}/>
            </div>
            <p className="text-sm text-slate-400">
              What will it look like on your CV
            </p>
            {photoError && (
              <p className="text-xs text-red-400 -mt-1">A photo is required</p>
            )}

            <button
            onClick={handleNext}
            className='mt-2 px-6 py-2 bg-emerald-400 text-slate-900 font-semibold rounded-lg hover:bg-emerald-300 transition'
            >
              Next →
            </button>
          </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

export default CVStep1Photo;