// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.NASA_API_KEY = 'test_key';
process.env.OPENAI_API_KEY = '';
process.env.NASA_BASE_URL = 'https://api.nasa.gov/';
process.env.EPIC_BASE_URL = 'https://epic.gsfc.nasa.gov/';
process.env.IMAGES_BASE_URL = 'https://images-api.nasa.gov/';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Suppress console output during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
