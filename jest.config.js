module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '@op-engineering/op-sqlite': '<rootDir>/__mocks__/@op-engineering/op-sqlite.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@tanstack|react-redux|@reduxjs/toolkit|immer|@testing-library)/)',
  ],
};
