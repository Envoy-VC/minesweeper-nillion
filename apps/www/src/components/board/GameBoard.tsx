'use client';

import Image from 'next/image';

import React from 'react';

import { useMap } from 'usehooks-ts';
import { TILES } from '~/assets';

const BOARD_ROWS = 24;
const BOARD_COLS = 24;

const GameBoard = () => {
  const [board, actions] = useMap<string, boolean>();

  return (
    <div className='flex flex-col gap-8'>
      <div className='relative'>
        {Array(BOARD_ROWS)
          .fill(true)
          .map((_, rowIdx) => (
            <div key={rowIdx} className='flex'>
              {Array(BOARD_COLS)
                .fill(true)
                .map((_, colIdx) => {
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
