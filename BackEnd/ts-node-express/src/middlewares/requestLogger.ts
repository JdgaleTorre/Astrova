import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  const start = Date.now();
  const { method, url, body } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor =
      status >= 500
        ? '\x1b[31m'
        : status >= 400
          ? '\x1b[33m'
          : status >= 300
            ? '\x1b[36m'
            : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(`\n[DEV] ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      console.log(`      Body: ${JSON.stringify(body)}`);
    }
    console.log(`      ${statusColor}→ ${status}${reset} (${duration}ms)\n`);
  });

  next();
};
