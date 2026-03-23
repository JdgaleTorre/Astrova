const path = require('path');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/middlewares/errorHandler.ts',
    'src/middlewares/rateLimiter.ts',
    'src/routes/health.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/app.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 50,
      lines: 40,
      statements: 40,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
  moduleDirectories: ['node_modules', 'src'],
  rootDir: __dirname,
  detectOpenHandles: true,
  forceExit: true,
};
