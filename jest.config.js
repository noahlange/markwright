module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/helpers'],
  globals: { 'ts-jest': { useESM: true } },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/**/*.ts', '<rootDir>/src/tests/**/*.tsx'],
  testPathIgnorePatterns: ['node_modules', '<rootDir>/src/tests/helpers'],
  verbose: true
};
