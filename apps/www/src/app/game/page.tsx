'use client';

import { useSearchParams } from 'next/navigation';

import React from 'react';

import { getMines } from '~/lib/nillion';

import { GameBoard } from '~/components';

const GamePage = () => {
  const params = useSearchParams();
  const id = params.get('id');

  const [mines, setMines] = React.useState<[number, number][] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const getBoard = async () => {
    try {
      if (!id) throw new Error('No ID provided');
      const res = await getMines(id);
      if (!res) throw new Error('No board found');
      setMines(res);
      console.log(res);
      return res;
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className='h-full py-10'>
      {!mines && (
        <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
          <button
            className='px-6 py-1 text-base font-medium'
            onClick={async () => {
              await getBoard();
            }}
          >
            Start Game
          </button>
          {error && (
            <div className='max-w-md text-center text-base text-red-500'>
              {error}
            </div>
          )}
        </div>
      )}
      {mines && (
        <div className='flex items-center justify-center'>
          <GameBoard mines={mines} />
        </div>
      )}
    </div>
  );
};

export default GamePage;
