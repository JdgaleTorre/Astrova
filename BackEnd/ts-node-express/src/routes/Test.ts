import { Router, Request, Response, NextFunction } from 'express';


const router = Router();

export const test = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({
            success: true,
            message: 'Astrova API is running 🚀',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};
router.get('/', test);


export default router;