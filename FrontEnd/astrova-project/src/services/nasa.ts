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
    ai_summary: string
}

export interface ApodParams {
    date?: string
    start_date?: string
    end_date?: string
    count?: number
}

export const getApod = async (params?: ApodParams): Promise<ApodResponse[]> => {
    const { data } = await api.get('/api/nasa/apod', { params })
    const result = data.data
    return Array.isArray(result) ? result : [result]
}

export interface EpicImage {
    identifier: string
    caption: string
    image: string
    date: string
    version: string
    centroid_coordinates: { lat: number; lon: number }
    dscovr_j2000_position: { x: number; y: number; z: number }
    lunar_j2000_position: { x: number; y: number; z: number }
    sun_j2000_position: { x: number; y: number; z: number }
    attitude_quaternions: { q0: number; q1: number; q2: number; q3: number }
}

export type EpicType = 'natural' | 'enhanced'

export const getEpic = async (type: EpicType = 'natural'): Promise<EpicImage[]> => {
    const { data } = await api.get('/api/nasa/epic', { params: { type } })
    return data.data
}

export const getEpicDates = async (type: EpicType = 'natural'): Promise<{ date: string }[]> => {
    const { data } = await api.get('/api/nasa/epic/dates', { params: { type } })
    return data.data
}

export const getEpicByDate = async (date: string, type: EpicType = 'natural'): Promise<EpicImage[]> => {
    const { data } = await api.get(`/api/nasa/epic/${date}`, { params: { type } })
    return data.data
}

export interface NeoAsteroid {
    id: string
    name: string
    nasa_jpl_url: string
    absolute_magnitude_h: number
    estimated_diameter: {
        kilometers: { estimated_diameter_min: number; estimated_diameter_max: number }
        meters: { estimated_diameter_min: number; estimated_diameter_max: number }
        miles: { estimated_diameter_min: number; estimated_diameter_max: number }
        feet: { estimated_diameter_min: number; estimated_diameter_max: number }
    }
    is_potentially_hazardous_asteroid: boolean
    close_approach_data: Array<{
        close_approach_date: string
        close_approach_date_full: string
        relative_velocity: { kilometers_per_hour: string; kilometers_per_second: string; miles_per_hour: string }
        miss_distance: { astronomical: string; lunar: string; kilometers: string; miles: string }
        orbiting_body: string
    }>
}

export interface NeoFeedResponse {
    element_count: number
    near_earth_objects: Record<string, NeoAsteroid[]>
    aiSummary: string
}

export interface NeoParams {
    start_date?: string
    end_date?: string
}

export const getAsteroids = async (params?: NeoParams): Promise<NeoFeedResponse> => {
    const { data } = await api.get('/api/nasa/asteroids', { params })
    return { ...data.data, aiSummary: data.aiSummary }
}

export const getAsteroidById = async (id: string): Promise<NeoAsteroid> => {
    const { data } = await api.get(`/api/nasa/asteroids/${id}`)
    return data.data
}

export interface EarthImageryResponse {
    id: string
    url: string
}

export const getEarthImagery = async (lon: number, lat: number, dim?: number, date?: string): Promise<string> => {
    const { data } = await api.get('/api/nasa/earth/imagery', { params: { lon, lat, dim, date } })
    return data.data
}

export interface EarthAssetsResponse {
    id: string
    resource: { dataset: string; planet: string }
    url: string
}

export const getEarthAssets = async (lon: number, lat: number, date: string, dim?: number): Promise<EarthAssetsResponse> => {
    const { data } = await api.get('/api/nasa/earth/assets', { params: { lon, lat, date, dim } })
    return data.data
}

export interface MediaAsset {
    data: Array<{
        nasa_id: string
        title: string
        description: string
        media_type: string
        date_created: string
        photographer?: string
    }>
    href: string
    links?: Array<{ href: string; rel: string; render: string }>
}

export interface ImageSearchParams {
    q?: string
    media_type?: 'image' | 'video' | 'audio'
    page?: number,
    nasa_id?: string,
}

export const searchImages = async (params: ImageSearchParams): Promise<{ collection: { items: MediaAsset[] } }> => {
    const { data } = await api.get('/api/nasa/images/search', { params });
    return data.data
}

export const getImageById = async (id: string) => {
    // call both endpoints in parallel
    const [searchRes, assetRes] = await Promise.all([
        api.get(`/api/nasa/images/search`, { params: { nasa_id: id } }),
        api.get(`/api/nasa/images/${id}`),
    ]);

    const metadata = searchRes.data.data.collection.items[0];
    const assets = assetRes.data.data.collection.items;

    return {
        metadata,   // title, description, date, photographer etc
        assets,     // array of { href } for all media files
    };
}