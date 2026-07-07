import StepProgressBar from '../../components/cv/StepProgressBar.jsx';
import WorkExperienceInput from '../../components/cv/WorkExperienceInput.jsx';
import EducationInput from '../../components/cv/EducationInput.jsx';
import ReferenceInput from '../../components/cv/ReferenceInput.jsx';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuggestionBanner from '../../components/shared/SuggestionBanner.jsx';

function CVStep4Experience() {

  const navigate = useNavigate();
  const { cvData, updateExperience, markStepComplete } = useCVBuilder()

  const e = cvData.experience

  // Seed all fields from context so returning restores the form
  const [workExperience, setWorkExperience] = useState(e.workExperience || []);
  const [education, setEducation] = useState(e.education || []);
  const [references, setReferences] = useState(e.references || []);
  const [submitted, setSubmitted] = useState(false)

  const isFormValid = education.length >= 1

  // Auto-save to context whenever any field changes
  useEffect(() => {
    updateExperience({ workExperience, education, references })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workExperience, education, references])

  const handleNext = () => {
    setSubmitted(true)
    if (!isFormValid) return
    markStepComplete(4)
    navigate('/cv/step5');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={4} />
      <SuggestionBanner />

      <div className="w-full max-w-2xl bg-slate-800/60 border border-slate-700/80 rounded-2xl shadow-xl shadow-black/20 p-6 sm:p-8 mt-6 flex flex-col gap-6">

        <div>
          <h2 className="text-lg font-bold">Experience</h2>
          <p className="text-sm text-slate-400 mt-1">Your work history, education, and references.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Work Experience
            <span className="text-slate-500 font-normal ml-1">(optional)</span>
          </label>
          <WorkExperienceInput entries={workExperience} onChange={setWorkExperience} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Education
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className={submitted && education.length === 0 ? 'rounded-lg ring-1 ring-red-400/50' : ''}>
            <EducationInput entries={education} onChange={setEducation} />
          </div>
          {submitted && education.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Please add at least one education entry.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            References
            <span className="text-slate-500 font-normal ml-1">(optional)</span>
          </label>
          <ReferenceInput entries={references} onChange={setReferences} />
        </div>

        <div className="flex justify-between items-center border-t border-slate-700/80 pt-5 mt-1">
          <button onClick={() => navigate('/cv/step3')}
            className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition">
            ← Back
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 bg-emerald-400 text-slate-900 font-semibold rounded-lg hover:bg-emerald-300 transition">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVStep4Experience;