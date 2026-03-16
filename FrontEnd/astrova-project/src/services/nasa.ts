import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
})

export interface ApodResponse {
    date: string
    title: string
    explanation: string
    url: string
    hdurl: string
    media_type: 'image' | 'video'
    copyright?: string
}

export const getApod = async (date?: string): Promise<ApodResponse> => {

    const { data } = await api.get('/api/nasa/apod', { params: { date } })

    return data.data
}