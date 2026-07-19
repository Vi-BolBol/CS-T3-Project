import { createContext, useContext, useState, useEffect } from "react";

const CVBuilderContext = createContext(null)

const initialCvData = {
    photo: null,
    personal: {
        fullName: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        location: '',
        gender: '',
        phoneNumber: '',
        email: '',
    },
    about: {
        aboutMe: '',
        skills: [],
        hobbies: [],
        languages: [],
        links: [],
    },
    experience: {
        workExperience: [],
        education: [],
        references: [],
    },
}

// The provider only wraps /cv/* routes, so it unmounts the moment the person
// navigates to Home/Profile/etc. Without persistence the whole CV was lost and
// the builder fell back to the "upload or create" choice screen. Persist to
// localStorage so a CV survives navigation and refreshes.
// TODO(backend): replace with POST/GET /api/cv once the Cv model is wired up.
const CV_KEY = 'if-cv-data'
const STEPS_KEY = 'if-cv-steps'

function loadCvData(){
    try {
        const raw = localStorage.getItem(CV_KEY)
        if (!raw) return initialCvData
        const parsed = JSON.parse(raw)
        // Merge so newly-added fields aren't missing on older saved CVs.
        return {
            ...initialCvData,
            ...parsed,
            personal: { ...initialCvData.personal, ...(parsed.personal || {}) },
            about: { ...initialCvData.about, ...(parsed.about || {}) },
            experience: { ...initialCvData.experience, ...(parsed.experience || {}) },
        }
    } catch { return initialCvData }
}

function loadSteps(){
    try { return new Set(JSON.parse(localStorage.getItem(STEPS_KEY) || '[]')) }
    catch { return new Set() }
}

export function CVBuilderProvider({ children }){
    const [cvData, setCvData] = useState(loadCvData)

    // Track which steps have been fully completed (clicked Next successfully)
    const [completedSteps, setCompletedSteps] = useState(loadSteps)

    // Persist on every change so nothing is lost when the provider unmounts.
    useEffect(() => {
        try { localStorage.setItem(CV_KEY, JSON.stringify(cvData)) } catch { /* quota */ }
    }, [cvData])

    useEffect(() => {
        try { localStorage.setItem(STEPS_KEY, JSON.stringify([...completedSteps])) } catch { /* quota */ }
    }, [completedSteps])

    // Holds the suggestion the user clicked "Improve" on, so the target
    // step page can read it and show a hint banner. Cleared once the user
    // navigates away from that step (or dismisses it manually).
    const [activeSuggestion, setActiveSuggestion] = useState(null); // { section, note } | null

    const clearActiveSuggestion = () => {
        setActiveSuggestion(null)
    }

    const markStepComplete = (step) => {
        setCompletedSteps((prev) => new Set([...prev, step]))
    }

    // Wipes all CV data and progress — used when the person chooses to
    // start a brand new CV from the dashboard.
    const resetCV = () => {
        setCvData(initialCvData)
        setCompletedSteps(new Set())
        try {
            localStorage.removeItem(CV_KEY)
            localStorage.removeItem(STEPS_KEY)
            localStorage.removeItem('if-cv-status')
            window.dispatchEvent(new Event('if-cv-changed'))
        } catch { /* ignore */ }
    }

    const updatePhoto = (photoData) => {
        setCvData((prev) => ({ ...prev, photo: photoData }))
    }

    const updatePersonal = (personalData) => {
        setCvData((prev) => ({ ...prev, personal: { ...prev.personal, ...personalData}}))
    }

    const updateAbout = (aboutData) => {
        setCvData((prev) => ({ ...prev, about: { ...prev.about, ...aboutData}}))
    }

    const updateExperience = (experienceData) => {
        setCvData((prev) =>  ({
            ...prev, experience: {...prev.experience, ...experienceData}
        }))
    }

    return(
        <CVBuilderContext.Provider
        value={{
            cvData, completedSteps, markStepComplete, resetCV,
            updatePhoto, updatePersonal, updateAbout, updateExperience,
            activeSuggestion, setActiveSuggestion, clearActiveSuggestion,
        }}>
            {children}
        </CVBuilderContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCVBuilder(){
    const context = useContext(CVBuilderContext)
    if(!context){
        throw new Error('useCVBuilder must be used within a CVBuilderProvider')
    }
    return context
}