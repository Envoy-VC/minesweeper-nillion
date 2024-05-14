'use client';

import Image from 'next/image';

import React from 'react';

import { useGame } from '~/lib/hooks';
import { useGameStore } from '~/lib/stores';

import { TILES } from '~/assets';

import type { JsInput } from '~/types/nillion';

const GameBoard = () => {
  const { board } = useGameStore();
  const { makeMove } = useGame();

  const getBoardInputs = () => {
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

  const play = async (row: number, col: number) => {
    try {
      const inputs: JsInput[] = [];
      const boardInputs = getBoardInputs();
      inputs.push(...boardInputs);
      inputs.push({
        name: `location-0`,
        value: String(row),
      });
      inputs.push({
        name: `location-1`,
        value: String(col),
      });

      // TODO: Add Mines
      await makeMove(inputs);
    } catch (error) {}
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='relative'>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className='flex'>
            {row.map((ele, colIdx) => {
              const type = ele;
              const key = `${rowIdx}-${colIdx}`;
              return (
                <div className='cursor-pointer' key={`tile-${key}`}>
                  <Image
                    src={TILES.default}
                    alt='Default Tile'
                    className='h-[24px] w-[24px]'
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
