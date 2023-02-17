import GivenError from './GivenError';

type GivenOption = {
  name: string;
  immediate: boolean;
  cache: boolean;
};

const RESERVED = ['name', 'length', 'caller', 'arguments'];
const REG_RESERVED = /^__(.+?)__$/;

const parseProp = (key: string) => {
  const prefix = key[0];

  const defaults = {
    name: key,
    immediate: false,
    cache: true,
  };

  if (prefix === '!') {
    defaults.name = key.substr(1);
    defaults.immediate = true;

    return defaults;
  }

  if (prefix === '@') {
    defaults.name = key.substr(1);
    defaults.cache = false;

    return defaults;
  }

  return defaults;
};

class Given {
  private options: GivenOption;

  private isRecursively = false;

  __env__ = {};

  __clear__ = () => {
    const keys = Object.keys(this.__env__);
    this.__env__ = {};
    keys.forEach((k) => delete this[k]);
  };

  __reset__ = (key: string) => {
    if (key) {
      this.__env__[key] = undefined;
    } else {
      this.__env__ = {};
    }
  };

  fn: () => void;

  throwGivenError() {
    if (RESERVED.indexOf(this.options.name) !== -1) {
      throw new GivenError([
        'Can not override the "length", "caller", "arguments" and "name" properties.',
        'Could you use a another property name?',
      ]);
    }

    if (REG_RESERVED.test(this.options.name)) {
      throw new GivenError([
        'Sorry, Given2 use properties that begins and ends with "__" for internal causes.',
        'Could you use an another name?',
      ]);
    }

    if (typeof this.fn !== 'function') {
      throw new GivenError([
        `You used not a function as a value for a given variable "${this.options.name}"`,
        `Could you declare variables something like this: given("${this.options.name}", () => ${JSON.stringify(this.fn)})?`,
        'Because we need a function to declare a getter.',
      ]);
    }
  }

  define() {
    Object.defineProperty(this, this.options.name, {
      enumerable: true,
      configurable: true,
      get: this.getter,
    });

    if (this.options.immediate) {
      this.getter();
    }
  }

  private getter() {
    const handler = () => {
      this.__env__[this.options.name] = undefined;

      if (this.options.cache === false) {
        return this.fn();
      }

      if (this.__env__[this.options.name]) {
        return this.__env__[this.options.name];
      }

      this.__env__[this.options.name] = this.fn();

      return this.__env__[this.options.name];
    };

    if (this.isRecursively) {
      throw new GivenError(`An attempt to use a variable recursively at given '${this.options.name}'.`);
    }

    this.isRecursively = true;
    let value;

    try {
      value = handler();
    } catch (e) {
      this.isRecursively = false;
      throw e;
    }

    this.isRecursively = false;

    return value;
  }

  action(property: string, fn: () => void) {
    this.options = parseProp(property);
    this.fn = fn;
    this.throwGivenError();
    this.define();
  }
}

export default Given;
