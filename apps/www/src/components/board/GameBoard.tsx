'use client';

import Image from 'next/image';

import React from 'react';

import { useGameStore } from '~/lib/stores';

import { TILES } from '~/assets';

const GameBoard = () => {
  const { board } = useGameStore();

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
