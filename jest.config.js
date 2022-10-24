/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  preset: 'ts-jest',
  testRegex: '.spec.ts$',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      isolatedModules: false,
    },
  },
  resetMocks: true,
  clearMocks: true,
  // resolver: '@nrwl/jest/plugins/resolver',
  moduleNameMapper: {
    '@database/postgres': '<rootDir>/src/db/postgres/index.ts',
    '@core': '<rootDir>/src/core/index.ts',
  }
};