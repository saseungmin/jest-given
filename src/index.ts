import Container from './container';

export type Given = {
  <T = never>(key: string, callback: () => T): T;
  [key: string]: never;
};

const before = (fn: () => void) => {
  if (typeof beforeEach === 'function') {
    beforeEach(fn);
  }
};

const after = (fn: () => void) => {
  if (typeof afterEach === 'function') {
    afterEach(fn);
  }
};

const initialGiven = () => {
  let it = false;

  const given = Container((run) => {
    if (it) {
      run();
      return;
    }

    before(() => run());
  });

  before(() => {
    it = true;
  });
  after(() => {
    it = false;
    given.__clear__();
  });

  return given;
};

export default initialGiven() as Given;
