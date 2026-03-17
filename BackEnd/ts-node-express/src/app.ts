import express from 'express';
import NasaRouter from './routes/NasaRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const app = express();

app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: origin ${origin} is not allowed`));
        }
    },
    methods: ['GET'],
}));

// Routes
app.use('/api/nasa/', NasaRouter);

// Global error handler (should be after routes)
app.use(errorHandler);
app.use(notFoundHandler)

export default app;