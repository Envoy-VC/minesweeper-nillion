'use client';

import Image from 'next/image';

import React from 'react';

import {
  getMinesInputs,
  getTileImage,
  getTilesLeft,
  getUpdatedBoard,
} from '~/lib/helpers';
import { useGame } from '~/lib/hooks';
import { useGameStore } from '~/lib/stores';
import { cn } from '~/lib/utils';

import { GameLost, Smiley } from '~/assets';
import { TILES } from '~/assets';
import { TILE_TYPE } from '~/types';

import DigitalDisplay from './DigitalDisplay';

import type { JsInput } from '~/types/nillion';

interface Props {
  mines: [number, number][];
}

const GameBoard = ({ mines }: Props) => {
  const {
    board,
    gameLost,
    gameEnded,
    tilesLeft,
    currentMoveCount,
    setResult,
    setBoard,
    setTile,
    setTilesLeft,
    incMoves,
    reset,
  } = useGameStore();
  const { makeMove } = useGame();

  const play = async (row: number, col: number) => {
    if (gameLost || gameEnded) return;
    if (board![row]![col] !== TILE_TYPE.UNTOUCHED) return;

    try {
      const inputs: JsInput[] = [];
      const minesInputs = getMinesInputs(mines);
      inputs.push(...minesInputs);
      inputs.push({
        name: `location-0`,
        value: String(row + 1),
      });
      inputs.push({
        name: `location-1`,
        value: String(col + 1),
      });
      const res = await makeMove(inputs);
      if (!res) return;
      if (res.game_over === '1') {
        setTile(TILE_TYPE.RED_MINE, row, col);
        setResult(true, true);
        alert('Game Over');
        return;
      }
      const updated = getUpdatedBoard(board, [row, col], mines);
      const tilesLeft = getTilesLeft(updated);
      if (tilesLeft === 0) {
        setResult(true, false);
      }
      setTilesLeft(tilesLeft);
      incMoves();
      setBoard(updated);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='relative flex items-center justify-center'>
        <div className='absolute left-0 top-1/2 -translate-y-1/2 '>
          <DigitalDisplay text={tilesLeft} />
        </div>
        <Image
          src={gameLost ? GameLost : Smiley}
          alt='Game Lost'
          className='h-12 w-12 object-cover'
        />
        <div className='absolute right-0 top-1/2 -translate-y-1/2 '>
          <DigitalDisplay text={currentMoveCount} />
        </div>
      </div>
      <div className='relative'>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className='flex'>
            {row.map((_, colIdx) => {
              const key = `${rowIdx}-${colIdx}`;
              const canPlay =
                board[rowIdx]![colIdx]! === TILE_TYPE.UNTOUCHED && !gameEnded;
              return (
                <div
                  className={canPlay ? 'cursor-pointer' : 'cursor-not-allowed'}
                  key={`tile-${key}`}
                  onClick={async () => {
                    await play(rowIdx, colIdx);
                  }}
                >
                  <Image
                    src={getTileImage(_)}
                    alt='Tile'
                    className='h-[24px] w-[24px]'
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {gameEnded && (
        <div className='flex w-full items-center justify-center'>
          <button
            className='mx-auto w-fit px-4 py-1 text-base font-medium'
            onClick={reset}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
