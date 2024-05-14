'use client';

import Image from 'next/image';

import React from 'react';

import { getBoardInputs, getMinesInputs } from '~/lib/helpers';
import { useGame } from '~/lib/hooks';
import { useGameStore } from '~/lib/stores';

import { TILES } from '~/assets';

import type { JsInput } from '~/types/nillion';

interface Props {
  mines: [number, number][];
}

const GameBoard = ({ mines }: Props) => {
  const { board } = useGameStore();
  const { makeMove } = useGame();

  const play = async (row: number, col: number) => {
    try {
      const inputs: JsInput[] = [];
      const boardInputs = getBoardInputs(board);
      const minesInputs = getMinesInputs(mines);
      inputs.push(...boardInputs, ...minesInputs);
      inputs.push({
        name: `location-0`,
        value: String(row + 1),
      });
      inputs.push({
        name: `location-1`,
        value: String(col + 1),
      });
      const res = await makeMove(inputs);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
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
                <div
                  className='cursor-pointer'
                  key={`tile-${key}`}
                  onClick={async () => {
                    console.log('Playing', rowIdx, colIdx);
                    await play(rowIdx, colIdx);
                  }}
                >
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
