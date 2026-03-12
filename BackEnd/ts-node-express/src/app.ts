import express from 'express';
import testRouter from './routes/Test';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/', testRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;