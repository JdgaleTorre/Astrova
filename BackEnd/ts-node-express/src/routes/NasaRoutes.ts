import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

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

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}planetary/apod?${params}`
        );

        res.json({ success: true, data: response.data });
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

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}EPIC/api/${type}?${params}`
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

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}EPIC/api/${type}/all?${params}`
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

        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
        });

        const response = await axios.get(
            `${process.env.NASA_BASE_URL}EPIC/api/${type}/date/${date}?${params}`
        );

        res.json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
});

// ─── NeoWs — Near Earth Object Web Service ────────────────
/**
 * GET /api/asteroids
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

        res.json({ success: true, data: response.data });
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

export default router;