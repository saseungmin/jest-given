class GivenError extends Error {
  constructor(message: string[] | string) {
    super();
    this.message = Array.isArray(message) ? message.join('\n') : message;
    this.name = 'Given';
  }
}

export default GivenError;
