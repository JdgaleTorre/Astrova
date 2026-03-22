import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mongoStatus =
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoStatus,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
