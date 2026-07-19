import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';
import CVPreviewPanel from '../../components/cv/CVPreviewPanel.jsx';
import TemplatePicker from '../../components/cv/TemplatePicker.jsx';
import PalettePicker from '../../components/cv/PalettePicker.jsx';
import ClassicTemplate from '../../components/cv/templates/ClassicTemplate.jsx';
import ModernTemplate from '../../components/cv/templates/ModernTemplate.jsx';
import ProfessionalTemplate from '../../components/cv/templates/ProfessionalTemplate.jsx';
import Toast from '../../components/shared/Toast.jsx';
import ConfirmDialog from '../../components/shared/ConfirmDialog.jsx';
import { scoreCV } from '../../api/cvApi.js';
import { generatePDF } from '../../utils/generatePDF.js';

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

// Sections that make up the "Edit Content" list — maps straight back to
// the builder steps so editing a section re-enters that step's form.
const EDIT_SECTIONS = [
  { id: 'photo',      step: 1, label: 'Photo',              hint: 'Your headshot' },
  { id: 'personal',   step: 2, label: 'Personal Info',      hint: 'Name, contact, location' },
  { id: 'about',      step: 3, label: 'About & Skills',     hint: 'Summary, skills, languages, links' },
  { id: 'experience', step: 4, label: 'Experience',         hint: 'Work history, education, references' },
];

const SECTION_TO_STEP = {
  'Photo': 1,
  'Personal Info': 2,
  'About & Skills': 3,
  'Experience': 4,
};

const NAV_ITEMS = [
  { id: 'preview', label: 'Preview',
    icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: 'edit', label: 'Edit Content',
    icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg> },
  { id: 'scoring', label: 'Scoring & Suggestions',
    icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
  { id: 'download', label: 'Download PDF',
    icon: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> },
];

function CVDashboard() {
  const navigate = useNavigate();
  const { cvData, completedSteps, resetCV, setActiveSuggestion, clearActiveSuggestion } = useCVBuilder();

  const [activeTab, setActiveTab] = useState('preview');
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [activePalette, setActivePalette] = useState(COLOR_PALETTES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // 'create' | 'upload' | null
  const [scoreData, setScoreData] = useState(null); // { score, summary, suggestions }
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState('');

  const handleCreateNew = () => {
    resetCV();
    setConfirmAction(null);
    navigate('/cv/step1');
  };

  const handleUploadInstead = () => {
    setConfirmAction(null);
    navigate('/cv');
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { pdf } = await generatePDF(cvData, activeTemplate, activePalette)
      const fileName = `${cvData.personal?.fullName?.replace(/\s+/g, '_') || 'CV'}_CV.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error('PDF generation failed: ', e);
      setToastMessage('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunScoring = async () => {
    setIsScoring(true);
    setScoreError('');
    try {
      const result = await scoreCV(cvData);
      setScoreData(result);
    } catch (err) {
      setScoreError(typeof err === 'string' ? err : 'Failed to score your CV. Please try again.');
    } finally {
      setIsScoring(false);
    }
  };

  const handleIgnoreSuggestion = (index) => {
    setScoreData((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((_, i) => i !== index),
    }));
  };

  const handleImproveSuggestion = (suggestion) => {
    setActiveSuggestion(suggestion);
    const step = SECTION_TO_STEP[suggestion.section] || 2;
    navigate(`/cv/step${step}`);
  };

  const renderTemplate = () => {
    if (activeTemplate === 'modern') return <ModernTemplate cvData={cvData} palette={activePalette} />;
    if (activeTemplate === 'professional') return <ProfessionalTemplate cvData={cvData} palette={activePalette} />;
    return <ClassicTemplate cvData={cvData} palette={activePalette} />;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface text-content flex">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-surface/60 border-r border-line min-h-screen flex flex-col py-6 px-4">
        <div className="px-2 mb-8">
          <h1 className="text-lg font-bold">My CV</h1>
          <p className="text-xs text-faint font-mono mt-0.5">Manage your profile</p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors border-l-2 ${
                  isActive
                    ? 'bg-accent/10 text-accent border-accent'
                    : 'text-subtle border-transparent hover:text-content hover:bg-raised/60'
                }`}
              >
                {item.icon({ className: 'w-4 h-4 shrink-0' })}
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 min-w-0">

        {/* Header card */}
        <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 px-6 py-5 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              {cvData.personal?.fullName ? `${cvData.personal.fullName}'s CV` : 'Your CV'}
            </h2>
            <p className="text-sm text-subtle mt-0.5">
              {completedSteps?.size >= 4 ? 'All sections complete' : 'Some sections still need attention'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmAction('upload')}
              className="px-4 py-2 border border-line text-content text-sm font-semibold rounded-lg hover:bg-muted/60 transition"
            >
              Upload a CV instead
            </button>
            <button
              onClick={() => setConfirmAction('create')}
              className="px-4 py-2 bg-accent text-accent-ink text-sm font-bold rounded-lg hover:bg-accent transition shadow-md shadow-accent/20"
            >
              + Create New CV
            </button>
          </div>
        </div>

        {/* Preview tab */}

        {activeTab === 'preview' && (
          <div
            className="flex-1 bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-4 min-w-0"
            style={{ maxHeight: 'calc(100vh - 220px)', overflowX: 'auto', overflowY: 'auto' }}
          >
            <div className="w-fit">
              <CVPreviewPanel>{renderTemplate()}</CVPreviewPanel>
            </div>
          </div>
        )}

        {/* Edit Content tab */}
        {activeTab === 'edit' && (
          <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 flex flex-col gap-3">
            {EDIT_SECTIONS.map((section) => {
              const isDone = completedSteps?.has(section.step);
              return (
                <div
                  key={section.id}
                  className="flex items-center justify-between bg-surface/60 border border-line rounded-xl px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-accent' : 'bg-muted'}`} />
                    <div>
                      <p className="font-semibold text-sm">{section.label}</p>
                      <p className="text-xs text-subtle">{section.hint}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      clearActiveSuggestion();
                      navigate(`/cv/step${section.step}`);
                    }}
                    className="px-4 py-1.5 bg-muted hover:bg-muted text-content text-sm font-semibold rounded-lg transition"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Scoring & Suggestions tab */}
        {activeTab === 'scoring' && (
          <div className="flex flex-col gap-6">

            {isScoring && (
              <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-subtle">Analyzing your CV with AI — this takes a few seconds...</p>
              </div>
            )}

            {!isScoring && scoreError && (
              <div className="bg-raised/60 border border-red-500/40 rounded-2xl shadow-xl shadow-black/20 p-6 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-red-300">{scoreError}</p>
                <button
                  onClick={handleRunScoring}
                  className="px-4 py-2 bg-accent text-accent-ink text-sm font-bold rounded-lg hover:bg-accent transition"
                >
                  Try again
                </button>
              </div>
            )}

            {!isScoring && !scoreError && scoreData && (
              <>
                <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-4 border-accent/70 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-accent">{scoreData.score}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">CV Score</h3>
                    <p className="text-sm text-subtle mt-1">
                      {scoreData.summary || 'A rough read on how complete and recruiter-friendly your CV looks right now.'}
                    </p>
                  </div>
                </div>

                <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-subtle">Suggestions</h3>
                    <button
                      onClick={handleRunScoring}
                      className="text-xs text-subtle hover:text-accent transition"
                    >
                      Re-run scoring
                    </button>
                  </div>
                  {scoreData.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 bg-surface/60 border border-line rounded-xl px-5 py-4"
                    >
                      <div>
                        <p className="text-xs font-semibold text-accent uppercase tracking-wide">{s.section}</p>
                        <p className="text-sm text-subtle mt-1">{s.note}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleIgnoreSuggestion(i)}
                          className="px-3 py-1.5 border border-line text-subtle text-xs font-semibold rounded-lg hover:bg-muted/60 transition"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleImproveSuggestion(s)}
                          className="px-3 py-1.5 bg-accent text-accent-ink text-xs font-bold rounded-lg hover:bg-accent transition"
                        >
                          Improve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!isScoring && !scoreError && !scoreData && completedSteps?.size >= 4 && (
              <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-8 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-subtle">Get an AI-powered score and suggestions for your CV.</p>
                <button
                  onClick={handleRunScoring}
                  className="px-4 py-2 bg-accent text-accent-ink text-sm font-bold rounded-lg hover:bg-accent transition"
                >
                  Get CV Score & Suggestions
                </button>
              </div>
            )}

            {!isScoring && !scoreError && !scoreData && completedSteps?.size < 4 && (
              <div className="bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-8 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-subtle">
                  Finish all 4 sections of your CV before running AI scoring.
                </p>
                <button
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 border border-line text-content text-sm font-semibold rounded-lg hover:bg-muted/60 transition"
                >
                  Go to Edit Content
                </button>
              </div>
            )}
          </div>
        )}

        {/* Download tab */}
        {activeTab === 'download' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-72 shrink-0 bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-5 flex flex-col gap-5 h-fit">
              <div>
                <p className="text-sm font-medium text-subtle mb-2">Template</p>
                <TemplatePicker templates={TEMPLATES} activeTemplate={activeTemplate} onChange={setActiveTemplate} />
              </div>
              <div>
                <p className="text-sm font-medium text-subtle mb-2">Color Palette</p>
                <PalettePicker palettes={COLOR_PALETTES} activePalette={activePalette} onChange={setActivePalette} />
              </div>
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className={`w-full py-2.5 font-semibold rounded-lg text-sm transition ${
                  isGenerating
                    ? 'bg-muted text-subtle cursor-not-allowed'
                    : 'bg-accent text-accent-ink hover:bg-accent shadow-md shadow-accent/20'
                }`}
              >
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
              </button>
            </div>

            <div
              className="flex-1 bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-4 min-w-0"
              style={{ maxHeight: 'calc(100vh - 220px)', overflowX: 'auto', overflowY: 'auto' }}
            >
              <div className="w-fit">
                <CVPreviewPanel>{renderTemplate()}</CVPreviewPanel>
              </div>
            </div>
          </div>
        )}

      </main>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <ConfirmDialog
        open={confirmAction === 'create'}
        title="Start a brand new CV?"
        message="This will clear all the details in your current CV — photo, personal info, about, and experience. This can't be undone."
        confirmLabel="Yes, start fresh"
        onConfirm={handleCreateNew}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === 'upload'}
        title="Upload a CV instead?"
        message="You'll be taken back to the CV choice screen to upload an existing file instead of using the builder."
        confirmLabel="Yes, take me there"
        onConfirm={handleUploadInstead}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

export default CVDashboard;