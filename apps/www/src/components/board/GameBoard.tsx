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

  const mineKeys = mines.map((value) => `${value[0] - 1}-${value[1] - 1}`);

  const play = async (row: number, col: number) => {
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
      console.log({
        inputs,
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
            {row.map((_, colIdx) => {
              const key = `${rowIdx}-${colIdx}`;
              const isMine = mineKeys.includes(key);
              return (
                <div
                  className='relative cursor-pointer'
                  key={`tile-${key}`}
                  onClick={async () => {
                    await play(rowIdx, colIdx);
                  }}
                >
                  <div className='absolute'>{isMine && '*'}</div>
                  <Image
                    src={isMine ? TILES.mine : TILES.default}
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
