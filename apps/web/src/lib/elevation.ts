export const formatElevation = (elevationString: string) => {
  const parsedElevation = parseInt(elevationString);
  let unit = 'feet';
  if (parsedElevation === 1) unit = 'foot';
  return `${parsedElevation} ${unit}`;
};
