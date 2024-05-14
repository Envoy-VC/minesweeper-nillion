export const getRandomMineLocations = () => {
  const mines: string[] = [];

  const taken = new Map<string, boolean>();
  while (mines.length < 36) {
    const array = new Uint32Array(10);
    const bytes = crypto.getRandomValues(array);
    const randomX = bytes[0]! % 24;
    const randomY = bytes[1]! % 24;
    const key = `${randomX}-${randomY}`;
    if (!taken.has(key)) {
      mines.push(key);
      taken.set(key, true);
    }
  }

  return mines;
};
