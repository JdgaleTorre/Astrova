import request from 'supertest';
import express from 'express';

// Mock mongoose
jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: { readyState: 1 },
    Schema: class MockSchema {
      constructor() {}
    },
    model: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
    }),
  },
  connection: { readyState: 1 },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = require('axios');

// Mock AI service
jest.mock('../../src/services/aiService', () => ({
  getAiResponse: jest.fn().mockResolvedValue('Mocked AI summary'),
}));

// Mock openai
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked response' } }],
        }),
      },
    },
  }));
});

// Create mock router inline
const createMockRouter = () => {
  const router = express.Router();

  router.get('/apod', async (req, res) => {
    res.json({ success: true, data: { title: 'Test' } });
  });

  return router;
};

// Import rate limiter directly
import { globalLimiter } from '../../src/middlewares/rateLimiter';

const mockRouter = createMockRouter();

const app = express();
app.use(express.json());
app.use(globalLimiter);
app.use('/api/nasa', mockRouter);

describe('globalLimiter middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({ data: { test: 'data' } });
  });

  it('allows requests within limit', async () => {
    const response = await request(app).get('/api/nasa/apod');

    expect(response.status).not.toBe(429);
  });

  it('returns standard rate limit headers', async () => {
    const response = await request(app).get('/api/nasa/apod');

    expect(response.headers).toHaveProperty('ratelimit-limit');
    expect(response.headers).toHaveProperty('ratelimit-remaining');
  });
});

describe('rate limit exceeded behavior', () => {
  it('returns 429 when limit is exceeded', async () => {
    const rateLimit = require('express-rate-limit');
    const strictLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1,
      message: { success: false, error: 'Too many requests' },
      standardHeaders: true,
      legacyHeaders: false,
    });

    const testApp = express();
    testApp.use(strictLimiter);
    testApp.get('/test', (req, res) => res.json({ ok: true }));

    // First request should succeed
    const firstResponse = await request(testApp).get('/test');
    expect(firstResponse.status).not.toBe(429);

    // Second request should be rate limited
    const secondResponse = await request(testApp).get('/test');
    expect(secondResponse.status).toBe(429);
    expect(secondResponse.body.success).toBe(false);
  });
});
