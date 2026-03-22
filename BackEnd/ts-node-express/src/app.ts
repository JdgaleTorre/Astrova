import 'dotenv/config';
import express from 'express';
import NasaRouter from './routes/NasaRoutes';
import healthRouter from './routes/health';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { globalLimiter } from './middlewares/rateLimiter';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: origin ${origin} is not allowed`));
        }
    },
    methods: ['GET'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400,
}));
app.use(globalLimiter);

if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger);
}

// ── Connect to MongoDB ────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astrova')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));


// Routes
app.use('/api/health', healthRouter);
app.use('/api/nasa/', NasaRouter);

// Global error handler (should be after routes)
app.use(errorHandler);
app.use(notFoundHandler)

export default app;