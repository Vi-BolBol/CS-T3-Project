import { createContext, useContext, useState, useEffect } from "react";

const CVBuilderContext = createContext(null)

const STORAGE_KEY = "cvBuilder:data"
const COMPLETED_STEPS_KEY = "cvBuilder:completedSteps"

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

// Best-effort read from localStorage. If anything's missing, malformed, or
// storage is unavailable (e.g. private browsing), fall back to a fresh CV
// instead of throwing and breaking the whole app.
function loadCvData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return initialCvData
        const parsed = JSON.parse(raw)
        return { ...initialCvData, ...parsed }
    } catch {
        return initialCvData
    }
}

function loadCompletedSteps() {
    try {
        const raw = localStorage.getItem(COMPLETED_STEPS_KEY)
        if (!raw) return new Set()
        return new Set(JSON.parse(raw))
    } catch {
        return new Set()
    }
}

export function CVBuilderProvider({ children }){
    const [cvData, setCvData] = useState(loadCvData)

    // Track which steps have been fully completed (clicked Next successfully)
    const [completedSteps, setCompletedSteps] = useState(loadCompletedSteps)

    // Holds the suggestion the user clicked "Improve" on, so the target
    // step page can read it and show a hint banner. Cleared once the user
    // navigates away from that step (or dismisses it manually).
    const [activeSuggestion, setActiveSuggestion] = useState(null); // { section, note } | null

    // Persist to localStorage on every change so the CV survives navigating
    // away from /cv/* (which unmounts this provider) and page refreshes.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData))
        } catch {
            // Storage full or unavailable — data just won't persist this time.
        }
    }, [cvData])

    useEffect(() => {
        try {
            localStorage.setItem(COMPLETED_STEPS_KEY, JSON.stringify([...completedSteps]))
        } catch {
            // Storage full or unavailable — data just won't persist this time.
        }
    }, [completedSteps])

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
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(COMPLETED_STEPS_KEY)
        } catch {
            // Ignore — in-memory state is already reset either way.
        }
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