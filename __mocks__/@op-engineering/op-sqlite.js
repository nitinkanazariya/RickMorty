module.exports = {
  open: () => ({
    execute: jest.fn(() => ({ rows: [] })),
  }),
};
