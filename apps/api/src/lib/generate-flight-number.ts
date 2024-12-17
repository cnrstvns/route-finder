export const generateFlightNumber = (airlinePrefix: string) => {
  const prefix = airlinePrefix.toUpperCase();
  const randomFlightNumber = Math.floor(Math.random() * 5000) + 1;
  const paddedFlightNumber = randomFlightNumber.toString().padStart(2, '0');
  const flightNumber = `${prefix}${paddedFlightNumber}`;

  return flightNumber;
};
