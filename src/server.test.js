const server = require('./server');

describe('server', () => {
  it('returns hello world', () => {
    expect(server()).to.equal('Hello World');
  });
});
