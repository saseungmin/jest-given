/* eslint-disable no-undef */
describe('given', () => {
  given('count', () => 1);
  given('one', () => (given.count + 1));

  it('first', () => {
    given('first', () => 'foo');

    expect(given.one).toBe(2);
    expect(given.one).toBe(2);
    expect(given.first).toBe('foo');
  });

  it('second', () => {
    given('count', () => 2);
    given('second', () => 'bar');

    expect(given.one).toBe(3);
    expect(given.second).toBe('bar');
  });
});
