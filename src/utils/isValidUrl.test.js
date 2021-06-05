const { URL } = require('url');
const isValidUrlFactory = require('./isValidUrl');

describe('url', () => {
  const setup = () => {
    const dependencies = {
      URL,
    };

    const isValidUrl = isValidUrlFactory(dependencies);

    return {
      isValidUrl,
      dependencies,
    }
  }

  describe('when a valid url is given', () => {
    [
      'http://www.google.com',
      'https://www.intercom.io',
      'https://www.gmail.com',
      'https://www.gmail.com?someParam=true&anotherParam=false',
      'https://www.gmail.com#withSomeId',
    ].forEach((urlString) => {
      it('returns true', () => {
        const { isValidUrl } = setup();

        return expect(isValidUrl({ urlString })).to.be.true;
      });
    })
  });

  describe('when an invalid url is given', () => {
    [
      'www.google.com',
      'randomString',
      'httpswww.gmail.com',
      'http//www.gmail.com?someParam=true&anotherParam=false',
      {},
      undefined,
      null,
      false,
      100,
    ].forEach((urlString) => {
      it('returns false', () => {
        const { isValidUrl } = setup();

        return expect(isValidUrl({ urlString })).to.be.false;
      });
    })
  });
});