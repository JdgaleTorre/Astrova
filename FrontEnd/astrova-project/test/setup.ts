import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock import.meta for Jest environment (used by Vite)
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: '',
        DEV: false,
        PROD: true,
        MODE: 'test',
      },
    },
  },
  writable: true,
});
