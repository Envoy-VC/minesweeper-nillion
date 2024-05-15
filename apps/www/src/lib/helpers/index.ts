import { TILES } from '~/assets';
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

const isValid = (pos: [number, number]) => {
  const [row, col] = pos;
  return row >= 0 && row < 24 && col >= 0 && col < 24;
};

const isMine = (mines: [number, number][], pos: [number, number]) => {
  return mines.some((mine) => mine[0] - 1 === pos[0] && mine[1] - 1 === pos[1]);
};

const countAdjacentMines = (
  mines: [number, number][],
  pos: [number, number]
) => {
  const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
  const dy = [-1, 0, 1, -1, 1, -1, 0, 1];

  let count = 0;
  for (let i = 0; i < 8; i++) {
    const newRow = pos[0] + dx[i]!;
    const newCol = pos[1] + dy[i]!;
    if (isValid([newRow, newCol]) && isMine(mines, [newRow, newCol])) {
      count++;
    }
  }

  return count;
};

export const getUpdatedBoard = (
  board: TILE_TYPE[][],
  move: [number, number],
  mines: [number, number][]
): TILE_TYPE[][] => {
  const [row, col] = move;

  if (board![row]![col] !== TILE_TYPE.UNTOUCHED) {
    return board;
  }

  let updatedBoard: TILE_TYPE[][] = board.map((row) => [...row]);
  const count = countAdjacentMines(mines, [row, col]);

  updatedBoard![row]![col] = count + 1;

  if (count === 0) {
    const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dy = [-1, 0, 1, -1, 1, -1, 0, 1];
    for (let i = 0; i < 8; i++) {
      const newRow = row + dx[i]!;
      const newCol = col + dy[i]!;
      const valid = isValid([newRow, newCol]);
      const mine = isMine(mines, [newRow, newCol]);
      if (valid && !mine) {
        if (updatedBoard![newRow]![newCol] === TILE_TYPE.UNTOUCHED) {
          updatedBoard = getUpdatedBoard(updatedBoard, [newRow, newCol], mines);
        }
      }
    }
  }

  return updatedBoard;
};

export const getTilesLeft = (board: TILE_TYPE[][]) => {
  let count = 0;
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 24; j++) {
      const type = board[i]![j]!;
      if (type === TILE_TYPE.UNTOUCHED) {
        count++;
      }
    }
  }

  return count - 24;
};

export const getTileImage = (tile: TILE_TYPE) => {
  switch (tile) {
    case TILE_TYPE.UNTOUCHED:
      return TILES.default;
    case TILE_TYPE.ZERO:
      return TILES.zero;
    case TILE_TYPE.ONE:
      return TILES.one;
    case TILE_TYPE.TWO:
      return TILES.two;
    case TILE_TYPE.THREE:
      return TILES.three;
    case TILE_TYPE.FOUR:
      return TILES.four;
    case TILE_TYPE.FIVE:
      return TILES.five;
    case TILE_TYPE.SIX:
      return TILES.six;
    case TILE_TYPE.SEVEN:
      return TILES.seven;
    case TILE_TYPE.EIGHT:
      return TILES.eight;
    case TILE_TYPE.MINE:
      return TILES.mine;
    case TILE_TYPE.RED_MINE:
      return TILES.redMine;
    default:
      return TILES.default;
  }
};
