import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getAiResponse } from '../services/aiService';

const router = Router();

// ─── APOD — Astronomy Picture of the Day ─────────────────
/**
 * GET /api/apod
 * Query params:
 *   - date?: string (YYYY-MM-DD) — specific date, defaults to today
 *   - start_date?: string (YYYY-MM-DD) — start of date range
 *   - end_date?: string (YYYY-MM-DD) — end of date range
 *   - count?: number — random images count
 */
router.get('/apod', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, start_date, end_date, count } = req.query;

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
            ...(date && { date: date as string }),
            ...(start_date && { start_date: start_date as string }),
            ...(end_date && { end_date: end_date as string }),
            ...(count && { count: count as string }),
        });

        const { data } = await axios.get(
            `${process.env.NASA_BASE_URL}planetary/apod?${params}`
        );

        // NASA returns array for ranges, single object for single date
        // normalise to always be an array
        const apods = Array.isArray(data) ? data : [data];

        // ── Generate AI summaries ─────────────────────────
        let aiSummaries: string[] = [];

        if (process.env.OPENAI_API_KEY) {
            try {
                aiSummaries = await Promise.all(
                    apods.map((apod) => {
                        const prompt = `Explain this NASA astronomy picture in 2-3 sentences 
                                        for a general audience: "${apod.explanation}"`;
                        return getAiResponse(prompt);
                    })
                );
            } catch (aiError) {
                console.error('AI summary generation failed:', aiError);
                aiSummaries = apods.map(() => '');
            }
        }

        // ── Attach AI summary to each APOD ───────────────
        const enrichedData = apods.map((apod, index) => ({
            ...apod,
            ai_summary: aiSummaries[index] || null,
        }));

        res.json({
            success: true,
            // return array if range was requested, single object if single date
            data: Array.isArray(data) ? enrichedData : enrichedData[0],
        });

    } catch (error) {
        next(error);
    }
});


// ─── EPIC — Earth Polychromatic Imaging Camera ────────────
/**
 * GET /api/epic
 * Query params:
 *   - type?: string — 'natural' | 'enhanced' (default: natural)
 */
router.get('/epic', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type = 'natural' } = req.query;

        // const params = new URLSearchParams({
        //     api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        // });

        const response = await axios.get(
            `${process.env.EPIC_BASE_URL}api/${type}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/epic/dates
 * Query params:
 *   - type?: string — 'natural' | 'enhanced' (default: natural)
 */
router.get('/epic/dates', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type = 'natural' } = req.query;

        // const params = new URLSearchParams({
        //     api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        // });

        const response = await axios.get(
            `${process.env.EPIC_BASE_URL}api/${type}/all`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/epic/:date
 * Params:
 *   - date: string (YYYY-MM-DD)
 * Query params:
 *   - type?: string — 'natural' | 'enhanced' (default: natural)
 */
router.get('/epic/:date', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date } = req.params;
        const { type = 'natural' } = req.query;

        // const params = new URLSearchParams({
        //     api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        // });

        const response = await axios.get(
            `${process.env.EPIC_BASE_URL}api/${type}/date/${date}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

const summariseNeoData = (data: any) => {
    const allAsteroids = Object.values(data.near_earth_objects).flat() as any[];

    return {
        total: data.element_count,
        date_range: Object.keys(data.near_earth_objects).sort(),
        hazardous: allAsteroids.filter(a => a.is_potentially_hazardous_asteroid).map(a => ({
            name: a.name,
            diameter: a.estimated_diameter.meters,
            velocity: a.close_approach_data[0].relative_velocity.kilometers_per_hour,
            distance: a.close_approach_data[0].miss_distance.kilometers,
        })),
        closest: allAsteroids
            .sort((a, b) =>
                parseFloat(a.close_approach_data[0].miss_distance.kilometers) -
                parseFloat(b.close_approach_data[0].miss_distance.kilometers)
            )
            .slice(0, 3)
            .map(a => ({
                name: a.name,
                distance: a.close_approach_data[0].miss_distance.kilometers,
                diameter: a.estimated_diameter.meters,
            })),
        largest: allAsteroids
            .sort((a, b) =>
                b.estimated_diameter.meters.estimated_diameter_max -
                a.estimated_diameter.meters.estimated_diameter_max
            )
            .slice(0, 3)
            .map(a => ({
                name: a.name,
                diameter: a.estimated_diameter.meters,
            })),
    };
};


// ─── NeoWs — Near Earth Object Web Service ────────────────
/**
 * GET /api/nasa/asteroids
 * Query params:
 *   - start_date?: string (YYYY-MM-DD) — defaults to today
 *   - end_date?: string (YYYY-MM-DD) — max 7 days after start_date
 */
router.get('/asteroids', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
            ...(start_date && { start_date: start_date as string }),
            ...(end_date && { end_date: end_date as string }),
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}neo/rest/v1/feed?${params}`
        );

        const nasaData = response.data;

        const processedData = summariseNeoData(nasaData)

        let aiSummary = null;
        if (process.env.OPENAI_API_KEY) {
            try {
                const prompt = `You are a space educator. Given this NASA Near Earth Objects data for a date range, 
                        provide a short and engaging insight (3-4 sentences) for a general audience. 
                        Highlight the most interesting findings such as the closest approach, largest asteroid, 
                        any potentially hazardous ones, and overall risk level. Keep it factual but exciting.

                        Data: ${JSON.stringify(processedData)}`;
                aiSummary = await getAiResponse(prompt);
            } catch (aiError) {
                console.error('AI summary generation failed:', aiError);
            }
        }

        res.json({
            success: true,
            data: nasaData,
            aiSummary
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/asteroids/:id
 * Params:
 *   - id: string — NASA NeoWs asteroid ID
 */
router.get('/asteroids/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}neo/rest/v1/neo/${id}?${params}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});


// ─── Earth — Satellite Imagery ───────────────────────────────
/**
 * GET /api/nasa/earth/imagery
 * Query params:
 *   - lon: number — longitude
 *   - lat: number — latitude
 *   - dim?: number — box size in degrees
 *   - date?: string (YYYY-MM-DD) — date of imagery (max 30 days ago)
 */
router.get('/earth/imagery', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lon, lat, dim, date } = req.query;

        if (!lon || !lat) {
            return res.status(400).json({ success: false, error: 'lon and lat are required' });
        }

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
            ...(lon && { lon: lon as string }),
            ...(lat && { lat: lat as string }),
            ...(dim && { dim: dim as string }),
            ...(date && { date: date as string }),
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}planetary/earth/imagery?${params}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/nasa/earth/assets
 * Query params:
 *   - lon: number — longitude
 * * lat: number — latitude
 *   - date: string (YYYY-MM-DD) — date of imagery
 *   - dim?: number — box size in degrees
 */
router.get('/earth/assets', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lon, lat, date, dim } = req.query;

        if (!lon || !lat || !date) {
            return res.status(400).json({ success: false, error: 'lon, lat, and date are required' });
        }

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
            ...(lon && { lon: lon as string }),
            ...(lat && { lat: lat as string }),
            ...(dim && { dim: dim as string }),
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}planetary/earth/assets?date=${date}&${params}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});


// ─── NASA Image and Video Library ────────────────────────────
/**
 * GET /api/nasa/images/search
 * Query params:
 *   - q: string — search query
 *   - media_type?: string — 'image' | 'video' | 'audio'
 *   - page?: number — page number
 */
router.get('/images/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, media_type, page, nasa_id } = req.query;

        if (!q && !nasa_id) {
            return res.status(400).json({
                success: false,
                error: 'Either q (search query) or nasa_id is required'
            });
        }

        const params = new URLSearchParams({
            ...(q && { q: q as string }),
            ...(media_type && { media_type: media_type as string }),
            ...(page && { page: page as string }),
            ...(nasa_id && { nasa_id: nasa_id as string }),
        });

        const response = await axios.get(
            `${process.env.IMAGES_BASE_URL}search?${params}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/nasa/images/:id
 * Params:
 *   - id: string — NASA image/video ID
 */
router.get('/images/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;


        const response = await axios.get(
            `${process.env.IMAGES_BASE_URL}asset/${id}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

export default router;