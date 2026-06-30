/* eslint-disable @typescript-eslint/no-require-imports */
// jest.config.js runs in Node.js directly before any transpilation occurs,
// so ESM `import` syntax is not available here. require() is intentional.

const nextJest = require('next/jest');
const createJestConfig = nextJest({dir: './'});

const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

module.exports = createJestConfig(config);
