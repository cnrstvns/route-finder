export const distanceInNauticalMiles = (
  latitudeOne: string,
  longitudeOne: string,
  latitudeTwo: string,
  longitudeTwo: string,
) => {
  const radius = 3440.065; // Earth's radius in nautical miles
  const parsedLatitudeOne = parseFloat(latitudeOne);
  const parsedLongitudeOne = parseFloat(longitudeOne);
  const parsedLatitudeTwo = parseFloat(latitudeTwo);
  const parsedLongitudeTwo = parseFloat(longitudeTwo);

  const dLat = toRadians(parsedLatitudeTwo - parsedLatitudeOne);
  const dLon = toRadians(parsedLongitudeTwo - parsedLongitudeOne);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(parsedLatitudeOne)) *
      Math.cos(toRadians(parsedLatitudeTwo)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = radius * c; // Distance in nautical miles

  return distance.toFixed(2);
};

const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};
