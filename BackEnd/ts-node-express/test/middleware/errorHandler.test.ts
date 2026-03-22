import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import {
  errorHandler,
  notFoundHandler,
} from '../../src/middlewares/errorHandler';

describe('errorHandler middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('notFoundHandler', () => {
    beforeEach(() => {
      const testApp = express();
      testApp.use(express.json());
      testApp.use(notFoundHandler);
      app = testApp;
    });

    it('returns 404 with correct error structure', async () => {
      const response = await request(app).get('/nonexistent-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('NOT_FOUND');
    });

    it('includes method and path in error message', async () => {
      const response = await request(app).post('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('POST');
      expect(response.body.error.message).toContain('/api/unknown');
    });

    it('includes timestamp in error response', async () => {
      const response = await request(app).get('/unknown');

      expect(response.body.error).toHaveProperty('timestamp');
    });
  });

  describe('errorHandler with AppError', () => {
    it('handles generic AppError with status code', async () => {
      const error = new Error('Something went wrong') as any;
      error.statusCode = 422;

      app.get('/test', (req: Request, res: Response, next: NextFunction) => {
        next(error);
      });
      app.use(errorHandler);

      const response = await request(app).get('/test');

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('SERVER_ERROR');
    });

    it('handles error without status code (defaults to 500)', async () => {
      const error = new Error('Internal error');

      app.get('/test', (req: Request, res: Response, next: NextFunction) => {
        next(error);
      });
      app.use(errorHandler);

      const response = await request(app).get('/test');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});
