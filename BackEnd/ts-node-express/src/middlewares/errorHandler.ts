import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

// ─── Types ────────────────────────────────────────────────
interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// ─── NASA-specific error messages ─────────────────────────
const NASA_ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad request sent to NASA API — check your query parameters.',
  401: 'Invalid NASA API key — check your NASA_API_KEY in .env.',
  403: 'Access forbidden by NASA API — your key may not have permission.',
  404: 'The requested NASA resource was not found.',
  429: 'NASA API rate limit exceeded — too many requests. Try again later.',
  500: 'NASA API internal server error — not your fault, try again later.',
  503: 'NASA API is temporarily unavailable — the service may be down, try again later.',
};

// ─── 404 handler — unknown routes ─────────────────────────
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} does not exist.`,
      timestamp: new Date().toISOString(),
    },
  });
};

// ─── Global error handler ─────────────────────────────────
export const errorHandler = (
  err: AppError | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log full error in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error(`\n[ERROR] ${req.method} ${req.path}`);
    console.error(`Message : ${err.message}`);
    console.error(`Stack   : ${err.stack}\n`);
  }

  // ── Axios errors (NASA API call failed) ───────────────
  if ((err as AxiosError).isAxiosError) {
    const axiosErr = err as AxiosError;
    const nasaStatus = axiosErr.response?.status;
    const nasaUrl = axiosErr.config?.url;
    const nasaData = axiosErr.response?.data;

    // NASA returned an error response
    if (nasaStatus) {
      return res.status(nasaStatus).json({
        success: false,
        error: {
          type: 'NASA_API_ERROR',
          status: nasaStatus,
          message: NASA_ERROR_MESSAGES[nasaStatus] ?? `NASA API responded with status ${nasaStatus}.`,
          nasa_url: nasaUrl,
          nasa_response: nasaData,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Request was made but no response received (timeout, connection refused)
    if (axiosErr.request) {
      return res.status(503).json({
        success: false,
        error: {
          type: 'NASA_UNREACHABLE',
          code: axiosErr.code,
          message: 'Could not reach the NASA API — it may be down or your network is unavailable.',
          nasa_url: nasaUrl,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  // ── Generic application errors ────────────────────────
  const statusCode = (err as AppError).statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    error: {
      type: 'SERVER_ERROR',
      status: statusCode,
      message: err.message || 'An unexpected error occurred.',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      timestamp: new Date().toISOString(),
    },
  });
};