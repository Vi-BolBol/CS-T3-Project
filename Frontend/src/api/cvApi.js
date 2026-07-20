import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60000,
})

/*
  Attach the bearer token to every CV/AI request.

  This module is the one place still using axios rather than fetch, and it was
  created before the AI routes required auth. Session A put `protect` on
  /api/cv/*, which meant every call from here started coming back 401 — the file
  picker opened, the upload ran, and parsing then failed with a generic
  "Failed to parse CV". Scoring and headshot generation were broken the same way.
*/
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

/** Turns an axios failure into the clearest message we can give the user. */
function toMessage(err, fallback) {
    const status = err?.response?.status
    if (status === 401) return 'Your session has expired. Please log in again.'
    if (status === 403) return err?.response?.data?.message || 'Your account cannot use this feature right now.'
    if (status === 429) return 'AI limit reached — CV parsing and scoring are capped at 60 per hour. Your saved CV is unaffected; try again shortly.'
    return err?.response?.data?.message || fallback
}

export async function parseUploadedCV(base64File) {
    try {
        const response = await api.post('/api/cv/parse-upload', { file: base64File })
        return response.data // { personal, about, experience }
    } catch (err) {
        throw toMessage(err, 'Failed to parse CV')
    }
}

export async function generateCVPhoto(base64Image){
    try {
        const response = await api.post('/api/cv/generate-photo', {
            image: base64Image,
        })
        return response.data.image
    } catch (err) {
        throw toMessage(err, 'Generation failed')
    }
}

export async function scoreCV(cvData) {
    try {
        const response = await api.post('/api/cv/score', { cvData })
        return response.data
    } catch (err) {
        throw toMessage(err, 'Scoring failed')
    }
}
