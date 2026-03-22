import rateLimit from 'express-rate-limit';
import { Request } from 'express';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => req.path === '/api/health',
});
