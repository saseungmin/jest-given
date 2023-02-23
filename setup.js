import given from './src/index.ts';

Object.defineProperty(global, 'given', {
  get() {
    return given;
  },
});
