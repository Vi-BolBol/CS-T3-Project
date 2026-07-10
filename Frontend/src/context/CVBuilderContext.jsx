import { createContext, useContext, useState } from "react";

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

export function CVBuilderProvider({ children }){
    const [cvData, setCvData] = useState(initialCvData)

    // Track which steps have been fully completed (clicked Next successfully)
    const [completedSteps, setCompletedSteps] = useState(new Set())

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