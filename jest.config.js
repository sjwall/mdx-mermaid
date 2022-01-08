/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  transform: {},
  globals: {
      'ts-jest': {
          useESM: true
      }
  },
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  roots: [
    'src'
  ]
}
