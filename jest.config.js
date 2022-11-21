module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-remirror/environment"],
  testEnvironment: "jsdom", // Required for dom manipulation
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules"],
};
