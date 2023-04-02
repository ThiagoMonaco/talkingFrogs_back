/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

// eslint-disable-next-line no-undef
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  roots: [
    '<rootDir>/tests'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>'
    ],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@tests/(.*)': '<rootDir>/tests/$1',
  },
  preset: '@shelf/jest-mongodb',
}
