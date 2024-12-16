/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "<rootDir>/tsconfig.json",  // Ensures ts-jest uses the correct TypeScript config
    }],
  },
};