import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateData(schema: z.ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Validate query params + route params
            schema.parse({ ...req.params, ...req.query });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                }));
                return next({
                    statusCode: 400,
                    message: 'Validation failed',
                    type: 'VALIDATION_ERROR',
                    details: errorMessages,
                });
            }
            next(error);
        }
    };
}