import express from 'express';
import NasaRouter from './routes/NasaRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/nasa/', NasaRouter);

// Global error handler (should be after routes)
app.use(errorHandler);
app.use(notFoundHandler);

export default app;