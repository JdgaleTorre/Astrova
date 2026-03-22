import request from 'supertest';
import express from 'express';

// Mock mongoose before importing health router
jest.mock('mongoose', () => {
  const mockConnection = {
    readyState: 1,
  };
  return {
    __esModule: true,
    default: {
      connect: jest.fn().mockResolvedValue({}),
      connection: mockConnection,
    },
    connection: mockConnection,
    Schema: class MockSchema {
      constructor() {}
    },
    model: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
    }),
  };
});

import healthRouter from '../../src/routes/health';

const app = express();
app.use('/api/health', healthRouter);

describe('GET /api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with success true', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('returns correct data structure with status, timestamp, uptime, mongodb', async () => {
    const response = await request(app).get('/api/health');

    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('uptime');
    expect(response.body.data).toHaveProperty('mongodb');
  });

  it('returns mongodb as connected when readyState is 1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.body.data.mongodb).toBe('connected');
  });

  it('returns status as ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.body.data.status).toBe('ok');
  });

  it('returns a valid timestamp', async () => {
    const response = await request(app).get('/api/health');
    const timestamp = new Date(response.body.data.timestamp);

    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });

  it('returns a positive uptime', async () => {
    const response = await request(app).get('/api/health');

    expect(typeof response.body.data.uptime).toBe('number');
    expect(response.body.data.uptime).toBeGreaterThanOrEqual(0);
  });
});
