import { create } from 'zustand';
import { TILE_TYPE } from '~/types';

interface State {
  gameEnded: boolean;
  board: TILE_TYPE[][];
}

interface Actions {
  setGameEnded: (gameEnded: boolean) => void;
  setTile(tile: TILE_TYPE, row: number, col: number): void;
  setTiles(data: { type: TILE_TYPE; row: number; column: number }[]): void;
  setBoard(board: TILE_TYPE[][]): void;
}

const initialBoard: TILE_TYPE[][] = Array(24).fill(
  Array(24).fill(TILE_TYPE.UNTOUCHED)
);

export const useGameStore = create<State & Actions>((set) => ({
  board: initialBoard,
  gameEnded: false,
  setBoard: (board) => set({ board }),
  setGameEnded: (gameEnded) => set({ gameEnded }),
  setTile: (tile, row, col) =>
    set((state) => {
      const newBoard = state.board;
      newBoard[row]![col]! = tile;
      return { board: newBoard };
    }),
  setTiles: (data) =>
    set((state) => {
      const newBoard = state.board;
      data.forEach((tile) => {
        newBoard[tile.row]![tile.column]! = tile.type;
      });
      return { board: newBoard };
    }),
}));
