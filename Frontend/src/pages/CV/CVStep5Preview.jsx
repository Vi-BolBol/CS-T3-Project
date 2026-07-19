import StepProgressBar from '../../components/cv/StepProgressBar.jsx';
import PalettePicker from '../../components/cv/PalettePicker.jsx';
import TemplatePicker from '../../components/cv/TemplatePicker.jsx';
import CVPreviewPanel from '../../components/cv/CVPreviewPanel.jsx';
import ClassicTemplate from '../../components/cv/templates/ClassicTemplate.jsx';
import ModernTemplate from '../../components/cv/templates/ModernTemplate.jsx';
import ProfessionalTemplate from '../../components/cv/templates/ProfessionalTemplate.jsx';
import Toast from '../../components/shared/Toast.jsx';
import { generatePDF } from '../../utils/generatePDF.js';
import { useState } from 'react';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';
import { saveCvToServer } from '../../hooks/useCvStatus';
import { useNavigate } from 'react-router-dom';

const COLOR_PALETTES = [
  { name: 'Emerald', primary: '#34D399', dark: '#0F172A' },
  { name: 'Ocean',   primary: '#60A5FA', dark: '#0F1729' },
  { name: 'Purple',  primary: '#A78BFA', dark: '#150F29' },
  { name: 'Rose',    primary: '#FB7185', dark: '#1F0F13' },
  { name: 'Amber',   primary: '#FBBF24', dark: '#1C150F' },
  { name: 'Slate',   primary: '#94A3B8', dark: '#0F172A' },
];

const TEMPLATES = [
  { id: 'classic',      name: 'Classic' },
  { id: 'modern',       name: 'Modern' },
  { id: 'professional', name: 'Professional' },
];

function CVStep5Preview() {
  const { cvData, markStepComplete } = useCVBuilder();
  const navigate = useNavigate();

  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [activePalette, setActivePalette] = useState(COLOR_PALETTES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Finishing must always land the user on the dashboard. A save failure is
  // worth telling them about, but it is not a reason to trap them on this page —
  // which is exactly what used to happen when the save threw.
  const handleFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    try {
      markStepComplete(5);
      const res = await saveCvToServer(cvData, 'built');
      if (!res?.success && res?.message) setToastMessage(res.message);
    } catch (err) {
      console.error('Finish CV failed:', err);
      setToastMessage('Saved on this device — we could not reach the server.');
    } finally {
      setIsFinishing(false);
      navigate('/cv/manage');
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try{
      const { pdf } = await generatePDF(cvData, activeTemplate, activePalette)
      const fileName = `${cvData.personal?.fullName?.replace(/\s+/g, '_') || 'CV'}_CV.pdf`
      pdf.save(fileName)
    } catch (e){
      console.error('PDF generation failed: ', e)
      setToastMessage('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface text-content flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={5} />

      <div className="w-full max-w-6xl mt-6 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">

          <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-5 flex flex-col gap-5">

            <div>
              <h2 className="text-lg font-bold mb-0.5">Finish Up</h2>
              <p className="text-xs text-subtle">Pick a look, then download your CV.</p>
            </div>

            <div>
              <p className="text-sm font-medium text-subtle mb-2">Template</p>
              <TemplatePicker 
              templates={TEMPLATES}
              activeTemplate={activeTemplate}
              onChange={setActiveTemplate}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-subtle mb-2">Color Palette</p>
              <PalettePicker 
              palettes={COLOR_PALETTES}
              activePalette={activePalette}
              onChange={setActivePalette}
              />
            </div>

            <button
              onClick={handleFinish}
              disabled={isFinishing}
              className={`w-full py-2.5 font-bold rounded-lg text-sm transition shadow-md shadow-accent/20 ${
                isFinishing
                  ? 'bg-muted text-faint cursor-not-allowed'
                  : 'bg-accent text-accent-ink hover:bg-accent'
              }`}
            >
              {isFinishing ? 'Saving…' : '✓ Finish CV'}
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className={`w-full py-2.5 font-semibold rounded-lg text-sm border transition ${
                isGenerating
                  ? 'border-line text-faint cursor-not-allowed'
                  : 'border-accent/50 text-accent hover:bg-accent/10'
              }`}
            >
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </button>

            <button
              onClick={() => navigate('/cv/step4')}
              className="w-full py-2.5 bg-muted text-content font-semibold rounded-lg text-sm hover:bg-muted transition"
            >
              ← Back to Experience
            </button>

          </div>
        </div>


        <div
        className="flex-1 bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-4"
        style={{
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          cursor: 'grab',
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget;
          el.style.cursor = 'grabbing';
          const startX = e.pageX - el.offsetLeft;
          const startY = e.pageY - el.offsetTop;
          const scrollLeft = el.scrollLeft;
          const scrollTop = el.scrollTop;
        
          const onMouseMove = (e) => {
            const x = e.pageX - el.offsetLeft;
            const y = e.pageY - el.offsetTop;
            el.scrollLeft = scrollLeft - (x - startX);
            el.scrollTop = scrollTop - (y - startY);
          };
        
          const onMouseUp = () => {
            el.style.cursor = 'grab';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
        
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        }}>
          <CVPreviewPanel>
            {activeTemplate === 'classic' && (
              <ClassicTemplate cvData={cvData} palette={activePalette} />
            )}
            {activeTemplate === 'modern' && (
              <ModernTemplate cvData={cvData} palette={activePalette} />
            )}
            {activeTemplate === 'professional' && (
              <ProfessionalTemplate cvData={cvData} palette={activePalette} />
            )}
          </CVPreviewPanel>
        </div>
        
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

export default CVStep5Preview;