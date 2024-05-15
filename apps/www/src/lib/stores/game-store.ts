import { create } from 'zustand';
import { TILE_TYPE } from '~/types';

interface State {
  currentMoveCount: string[];
  tilesLeft: string[];
  gameLost: boolean;
  gameEnded: boolean;
  board: TILE_TYPE[][];
  flags: string[];
}

interface Actions {
  setResult(ended: boolean, gameLost: boolean): void;
  setTile(tile: TILE_TYPE, row: number, col: number): void;
  setTiles(data: { type: TILE_TYPE; row: number; column: number }[]): void;
  setBoard(board: TILE_TYPE[][]): void;
  setTilesLeft(num: number): void;
  setFlag(flag: string): void;
  incMoves(): void;
  reset(): void;
}

const initialBoard: TILE_TYPE[][] = Array(24).fill(
  Array(24).fill(TILE_TYPE.UNTOUCHED)
);

export const useGameStore = create<State & Actions>((set, get) => ({
  board: initialBoard,
  gameEnded: false,
  gameLost: false,
  currentMoveCount: ['0', '0', '0'],
  tilesLeft: ['5', '5', '2'],
  flags: [],
  setBoard: (board) => set({ board }),
  setTile: (tile, row, col) => {
    const current = get().board;
    let newBoard: TILE_TYPE[][] = current.map((row) => [...row]);
    newBoard[row]![col]! = tile;
    set({ board: newBoard });
  },
  setTiles: (data) =>
    set((state) => {
      const newBoard = state.board;
      data.forEach((tile) => {
        newBoard[tile.row]![tile.column]! = tile.type;
      });
      return { board: newBoard };
    }),
  setResult: (gameEnded, gameLost) => set({ gameEnded, gameLost }),
  setTilesLeft: (num) => {
    const tilesLeft = num.toString().split('');
    while (tilesLeft.length < 3) {
      tilesLeft.unshift('0');
    }
    set({ tilesLeft });
  },
  incMoves: () => {
    const current = get().currentMoveCount;
    const moves = (parseInt(current.join('')) + 1).toString().split('');
    while (moves.length < 3) {
      moves.unshift('0');
    }
    set({ currentMoveCount: moves });
  },
  reset: () => {
    set({
      board: initialBoard,
      gameEnded: false,
      gameLost: false,
      currentMoveCount: ['0', '0', '0'],
      tilesLeft: ['5', '5', '2'],
    });
  },
  setFlag: (flag) => {
    const current = get().flags;
    if (current.includes(flag)) {
      const newFlags = current.filter((f) => f !== flag);
      set({ flags: newFlags });
    } else {
      set({ flags: [...current, flag] });
    }
  },
}));
