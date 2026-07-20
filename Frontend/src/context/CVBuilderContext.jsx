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
// localStorage is a fast first paint; the SERVER is the source of truth.
// Hydrated from GET /api/cv/mine on mount — see the effect in the provider.
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
    const [hydrated, setHydrated] = useState(false)

    // Track which steps have been fully completed (clicked Next successfully)
    const [completedSteps, setCompletedSteps] = useState(loadSteps)

    // Persist on every change so nothing is lost when the provider unmounts.
    /*
      Pull the saved CV back from the server on mount.

      The context only ever initialised from localStorage, so a CV was lost the
      moment that storage was cleared, the browser was changed, or another tab
      reset it — the student was dropped back to the "build or upload?" choice
      with their finished CV apparently gone. The row was in the database the
      whole time; nothing ever read it back into the builder.

      Local data wins while it has content, so an in-progress edit is never
      overwritten by an older server copy.
    */
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const token = localStorage.getItem('token')
            if (!token) { setHydrated(true); return }
            try {
                const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                const res = await fetch(`${base}/api/cv/mine`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) {
                    // A failed load is NOT the same as "no CV saved". Silently
                    // returning here is what made a rate-limited response look
                    // like the CV had been deleted.
                    console.warn(`[cv] could not load saved CV (HTTP ${res.status}) — keeping local copy`)
                    return
                }
                const data = await res.json()
                if (cancelled || !data?.success || !data.cv?.userCvData) return

                const local = (() => {
                    try { return JSON.parse(localStorage.getItem(CV_KEY) || 'null') }
                    catch { return null }
                })()
                const localHasContent = Boolean(local?.personal?.fullName || local?.about?.aboutMe)

                if (!localHasContent) {
                    const server = data.cv.userCvData
                    setCvData({
                        ...initialCvData,
                        ...server,
                        personal: { ...initialCvData.personal, ...(server.personal || {}) },
                        about: { ...initialCvData.about, ...(server.about || {}) },
                        experience: { ...initialCvData.experience, ...(server.experience || {}) },
                    })
                    // A CV that came back from the server has been completed.
                    setCompletedSteps(new Set([1, 2, 3, 4, 5]))
                }
            } catch { /* offline — the local mirror stands */ }
            finally { if (!cancelled) setHydrated(true) }
        })()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        // Don't persist the empty initial state over a good local copy before
        // hydration has had a chance to run.
        if (!hydrated && !cvData?.personal?.fullName) return
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