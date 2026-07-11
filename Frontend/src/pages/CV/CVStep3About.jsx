import StepProgressBar from "../../components/cv/StepProgressBar";
import SearchableTagInput from "../../components/cv/SearchableTagInput"
import LanguageInput from "../../components/cv/LanguageInput";
import LinkInput from "../../components/cv/LinkInput";
import { useCVBuilder } from "../../context/CVBuilderContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuggestionBanner from "../../components/shared/SuggestionBanner";

const suggestedSkills = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React.js', 'Vue.js', 'Tailwind CSS',
  'Node.js', 'Express.js', 'Python', 'Java', 'PHP', 'REST API',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase',
  'Git', 'GitHub', 'Figma', 'VS Code', 'Postman', 'Docker',
  'Teamwork', 'Communication', 'Problem Solving', 'Leadership', 'Time Management',
  'Microsoft Office', 'Google Workspace', 'Canva', 'Photoshop',
];

const suggestedHobbies = [
  'Reading', 'Writing', 'Drawing', 'Painting', 'Photography',
  'Gaming', 'Cooking', 'Baking', 'Travelling', 'Hiking',
  'Swimming', 'Football', 'Basketball', 'Badminton', 'Cycling',
  'Music', 'Singing', 'Dancing', 'Watching Movies', 'Volunteering',
  'Coding', 'Blogging', 'Gardening', 'Yoga', 'Meditation',
];

const ABOUT_MAX = 200

function CVStep3About() {

  const navigate = useNavigate()
  const { cvData, updateAbout, markStepComplete } = useCVBuilder()

  const a = cvData.about

  // Seed all fields from context so returning restores the form
  const [aboutMe, setAboutMe] = useState(a.aboutMe || '')
  const [hobbies, setHobbies] = useState(a.hobbies || [])
  const [skills, setSkills] = useState(a.skills || [])
  const [languages, setLanguages] = useState(a.languages || [])
  const [links, setLinks] = useState(a.links || [])
  const [submitted, setSubmitted] = useState(false)

  const isAboutValid = aboutMe.trim().length >= 1 && aboutMe.length <= ABOUT_MAX
  const isFormValid = isAboutValid && skills.length >= 1 && languages.length >= 1;

  // Auto-save to context whenever any field changes
  useEffect(() => {
    updateAbout({ aboutMe, skills, hobbies, languages, links })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutMe, skills, hobbies, languages, links])

  const handleNext = () => {
    setSubmitted(true)
    if (!isFormValid) return
    markStepComplete(3)
    navigate('/cv/step4')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface text-content flex flex-col items-center py-6 px-4">
      <StepProgressBar currentStep={3} />
      <SuggestionBanner />

      <div className="w-full max-w-2xl bg-raised/60 border border-line/80 rounded-2xl shadow-xl shadow-black/20 p-6 sm:p-8 mt-6 flex flex-col gap-6">

        <div>
          <h2 className="text-lg font-bold">About You</h2>
          <p className="text-sm text-subtle mt-1">What you're good at, and how you spend your time.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">About Me
            <span className="text-red-400 ml-1">*</span>
          </label>
          <textarea
          value={aboutMe}
          onChange={(e) => { if(e.target.value.length <= ABOUT_MAX) setAboutMe(e.target.value) }}
          placeholder="Write a short summary about yourself"
          rows={4}
          className={`w-full bg-surface/60 border rounded-lg px-3 py-2.5 text-sm resize-none transition-colors focus:outline-none focus:ring-1 ${
            submitted && !isAboutValid
              ? 'border-red-400 ring-1 ring-red-400/40'
              : 'border-line focus:border-accent focus:ring-accent/40'
          }`}
          />
          <div className="flex justify-between mt-1.5">
            <span className={`text-xs ${submitted && aboutMe.trim().length < 1 ? 'text-red-400' : 'text-faint'}`}>
              {submitted && aboutMe.trim().length < 1 ? 'Please write a short summary' : 'Brief summary of who you are'}
            </span>
            <span className={`text-xs ${aboutMe.length >= ABOUT_MAX ? 'text-red-400' : 'text-faint'}`}>
              {aboutMe.length} / {ABOUT_MAX}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Skills
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className={submitted && skills.length === 0 ? 'rounded-lg ring-1 ring-red-400/50' : ''}>
            <SearchableTagInput tags={skills} onChange={setSkills}
              suggestions={suggestedSkills} placeholder="Search or add a custom skill..." />
          </div>
          {submitted && skills.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Please add at least one skill.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Hobbies</label>
          <SearchableTagInput tags={hobbies} onChange={setHobbies}
            suggestions={suggestedHobbies} placeholder="Search or add a custom hobby..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Languages
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className={submitted && languages.length === 0 ? 'rounded-lg ring-1 ring-red-400/50' : ''}>
            <LanguageInput languages={languages} onChange={setLanguages} />
          </div>
          {submitted && languages.length === 0 && (
            <p className="text-xs text-red-400 mt-1.5">Please add at least one language.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-subtle mb-1.5">Links
            <span className="text-faint font-normal ml-1">(optional, max 5)</span>
          </label>
          <LinkInput links={links} onChange={setLinks} />
        </div>

        <div className="flex justify-between items-center border-t border-line/80 pt-5 mt-1">
          <button onClick={() => navigate('/cv/step2')}
            className="px-6 py-2 bg-muted text-content font-semibold rounded-lg hover:bg-muted transition">
            ← Back
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 bg-accent text-accent-ink font-semibold rounded-lg hover:bg-accent transition">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVStep3About;