const getGreatCircleDistanceFactory = require('./getGreatCircleDistance');

describe('getGreatCircleDistance', () => {
  const setup = ({ constants, convertDegreeToRadian } = {}) => {
    const dependencies = {
      constants: constants || {
        EARTH_RADIUS_KMS: 6371,
      },
      convertDegreeToRadian: convertDegreeToRadian || sinon.stub(),
    }

    const getGreatCircleDistance = getGreatCircleDistanceFactory(dependencies);

    return {
      dependencies,
      getGreatCircleDistance,
    }
  }

  it('converts degree to radians', () => {
    const { getGreatCircleDistance, dependencies } = setup();
    const inputParams = {
      latitude1: 23,
      latitude2: 33,
      longitude1: 130,
      longitude2: 140,
    }

    getGreatCircleDistance(inputParams);

    return expect(dependencies.convertDegreeToRadian.callCount).to.equal(4);
  });

  it('returns the great circle distance between input params in kms', () => {
    const convertDegreeToRadian = ({ degree }) => degree * Math.PI / 180;
    const { getGreatCircleDistance } = setup({ convertDegreeToRadian });
    const inputParams = {
      latitude1: 23,
      longitude1: 130,
      latitude2: 33,
      longitude2: 140,
    }

    return expect(getGreatCircleDistance(inputParams)).to.equal(1481.65);
  });
});
