import '@testing-library/jest-dom';

jest.mock('@/config/env', () => ({
  ENV: {
    API_URL: process.env.VITE_API_URL || 'http://localhost:5000/api',
    IS_DEV: process.env.NODE_ENV === 'development'
  }
}));
