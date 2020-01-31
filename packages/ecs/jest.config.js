module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shed/(.*)$': '<rootDir>/../$1/src',
  }
};
