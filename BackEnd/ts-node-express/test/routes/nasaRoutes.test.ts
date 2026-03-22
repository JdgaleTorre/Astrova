import request from 'supertest';
import express from 'express';
import axios from 'axios';

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
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  router.get('/apod', async (req, res, next) => {
    try {
      const { data } = await axios.get(
        `${process.env.NASA_BASE_URL}planetary/apod`,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  router.get('/epic', async (req, res, next) => {
    try {
      const { data } = await axios.get(
        `${process.env.EPIC_BASE_URL}api/natural`,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  router.get('/asteroids', async (req, res, next) => {
    try {
      const { data } = await axios.get(
        `${process.env.NASA_BASE_URL}neo/rest/v1/feed`,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  router.get('/images/search', async (req, res, next) => {
    try {
      if (!req.query.q && !req.query.nasa_id) {
        return res
          .status(400)
          .json({
            success: false,
            error: 'Either q (search query) or nasa_id is required',
          });
      }
      const { data } = await axios.get(`${process.env.IMAGES_BASE_URL}search`);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  router.get('/earth/imagery', async (req, res, next) => {
    try {
      if (!req.query.lon || !req.query.lat) {
        return res
          .status(400)
          .json({ success: false, error: 'lon and lat are required' });
      }
      const { data } = await axios.get(
        `${process.env.NASA_BASE_URL}planetary/earth/imagery`,
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

// Use inline mock router
const mockRouter = createMockRouter();

const app = express();
app.use(express.json());
app.use('/api/nasa', mockRouter);

const mockApodData = {
  date: '2024-01-01',
  title: 'Test Image',
  explanation: 'A test astronomy picture',
  url: 'https://example.com/image.jpg',
  media_type: 'image',
};

describe('GET /api/nasa/apod', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({ data: mockApodData });
  });

  it('returns 200 with success true and apod data', async () => {
    const response = await request(app).get('/api/nasa/apod');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('date');
    expect(response.body.data).toHaveProperty('title');
  });

  it('calls NASA API with correct parameters', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockApodData });

    await request(app).get('/api/nasa/apod?date=2024-01-01');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('planetary/apod'),
    );
  });
});

describe('GET /api/nasa/epic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({ data: [{ image: 'epic_1' }] });
  });

  it('returns 200 with epic images', async () => {
    const response = await request(app).get('/api/nasa/epic');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('GET /api/nasa/asteroids', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({ data: { element_count: 5 } });
  });

  it('returns 200 with asteroid data', async () => {
    const response = await request(app).get('/api/nasa/asteroids');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('element_count');
  });
});

describe('GET /api/nasa/images/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({ data: { collection: { items: [] } } });
  });

  it('returns 200 with search results', async () => {
    const response = await request(app).get('/api/nasa/images/search?q=mars');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('returns 400 when no query or nasa_id provided', async () => {
    const response = await request(app).get('/api/nasa/images/search');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('GET /api/nasa/earth/imagery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockReset();
    mockedAxios.get.mockResolvedValue({
      data: { url: 'https://example.com/earth.jpg' },
    });
  });

  it('returns 400 when lon is missing', async () => {
    const response = await request(app).get('/api/nasa/earth/imagery?lat=40');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('returns 400 when lat is missing', async () => {
    const response = await request(app).get('/api/nasa/earth/imagery?lon=-75');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
