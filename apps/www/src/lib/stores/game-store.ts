import { create } from 'zustand';
import { TILE_TYPE } from '~/types';

interface State {
  board: TILE_TYPE[][];
}

interface Actions {
  setBoard(board: TILE_TYPE[][]): void;
}

const initialBoard: TILE_TYPE[][] = Array(24).fill(
  Array(24).fill(TILE_TYPE.UNTOUCHED)
);

export const useGameStore = create<State & Actions>((set) => ({
  board: initialBoard,
  setBoard: (board) => set({ board }),
}));
