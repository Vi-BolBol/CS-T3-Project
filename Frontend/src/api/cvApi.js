import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60000,
})

export async function parseUploadedCV(base64File) {
    try {
        const response = await api.post('/api/cv/parse-upload', { file: base64File })
        return response.data // { personal, about, experience }
    } catch (err) {
        throw err.response?.data?.message || 'Failed to parse CV'
    }
}

export async function generateCVPhoto(base64Image){
    try {
        const response = await api.post('/api/cv/generate-photo', {
            image: base64Image,
        })
        return response.data.image
    } catch (err) {
        throw err.response?.data?.message || 'Generation failed'
    }
}

export async function scoreCV(cvData) {
    try {
        const response = await api.post('/api/cv/score', { cvData })
        return response.data
    } catch (err) {
        throw err.response?.data?.message || 'Scoring Failed'
    }
}