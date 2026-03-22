import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
})

export interface HealthResponse {
    status: string
    timestamp: string
    uptime: number
    mongodb: string
}

export const checkHealth = async (): Promise<HealthResponse> => {
    const { data } = await api.get('/api/health')
    return data.data
}