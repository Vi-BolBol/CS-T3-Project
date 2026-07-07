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
  const [toastMessage, setToastMessage] = useState('');

  const handleFinish = () => {
    markStepComplete(5);
    navigate('/cv/manage');
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={5} />

      <div className="w-full max-w-6xl mt-6 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">

          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/20 p-5 flex flex-col gap-5">

            <div>
              <h2 className="text-lg font-bold mb-0.5">Finish Up</h2>
              <p className="text-xs text-slate-400">Pick a look, then download your CV.</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Template</p>
              <TemplatePicker 
              templates={TEMPLATES}
              activeTemplate={activeTemplate}
              onChange={setActiveTemplate}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Color Palette</p>
              <PalettePicker 
              palettes={COLOR_PALETTES}
              activePalette={activePalette}
              onChange={setActivePalette}
              />
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-emerald-400 text-slate-900 font-bold rounded-lg text-sm hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20"
            >
              ✓ Finish CV
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className={`w-full py-2.5 font-semibold rounded-lg text-sm border transition ${
                isGenerating
                  ? 'border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10'
              }`}
            >
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </button>

            <button
              onClick={() => navigate('/cv/step4')}
              className="w-full py-2.5 bg-slate-700 text-white font-semibold rounded-lg text-sm hover:bg-slate-600 transition"
            >
              ← Back to Experience
            </button>

          </div>
        </div>


        <div
        className="flex-1 bg-slate-800/60 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/20 p-4"
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