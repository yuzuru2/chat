module.exports = {
  moduleNameMapper: {
    '^src/(.+)': '<rootDir>/src/$1'
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig_test.json'
    }
  },
  testMatch: ['<rootDir>/src/test/mongodb/**/*.test.ts']
};
