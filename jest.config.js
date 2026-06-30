/* eslint-disable @typescript-eslint/no-require-imports */
// jest.config.js runs in Node.js directly before any transpilation occurs,
// so ESM `import` syntax is not available here. require() is intentional.

const nextJest = require('next/jest');
const createJestConfig = nextJest({dir: './'});

const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    collectCoverageFrom: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
    ],
};

module.exports = createJestConfig(config);
