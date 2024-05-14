import { TILE_TYPE } from '~/types';

import type { JsInput } from '~/types/nillion';

export const getRandomMineLocations = () => {
  const mines: string[] = [];

  const taken = new Map<string, boolean>();
  while (mines.length < 24) {
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

export const getBoardInputs = (board: TILE_TYPE[][]) => {
  const inputs: JsInput[] = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 24; j++) {
      const value = String(board[i]![j]!);
      inputs.push({
        name: `board-${i}-${j}`,
        value,
      });
    }
  }

  return inputs;
};

export const getMinesInputs = (mines: [number, number][]) => {
  const inputs: JsInput[] = [];
  for (let i = 0; i < mines.length; i++) {
    const [row, col] = mines[i] as [number, number];
    inputs.push({
      name: `mine-x-${i}`,
      value: String(row),
    });
    inputs.push({
      name: `mine-y-${i}`,
      value: String(col),
    });
  }

  return inputs;
};
