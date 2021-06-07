module.exports = ({ constants, convertDegreeToRadian }) => ({ latitude1, longitude1, latitude2, longitude2 }) => {
  const φ1 = convertDegreeToRadian({ degree: latitude1 });
  const φ2 = convertDegreeToRadian({ degree: latitude2 });
  const Δφ = convertDegreeToRadian({ degree: latitude2 - latitude1 });
  const Δλ = convertDegreeToRadian({ degree: longitude2 - longitude1 });

  const arccos = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const Δσ = 2 * Math.atan2(Math.sqrt(arccos), Math.sqrt(1 - arccos));

  return Number((constants.EARTH_RADIUS_KMS * Δσ).toFixed(2)); // in kms
}
