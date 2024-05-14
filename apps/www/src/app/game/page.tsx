'use client';

import { useSearchParams } from 'next/navigation';

import React from 'react';

import { getMines } from '~/lib/nillion';

import { GameBoard } from '~/components';

const GamePage = () => {
  const [mines, setMines] = React.useState<[number, number][] | null>(null);
  const params = useSearchParams();
  const id = params.get('id');

  const getBoard = async () => {
    if (!id) return;
    console.log(id);
    const res = await getMines(id);
    if (!res) return;
    setMines(res);
    console.log(res);
    return res;
  };

  return (
    <div className='px-3 py-10'>
      {!mines && (
        <button
          className='px-6 py-1 text-base font-medium'
          onClick={async () => {
            await getBoard();
          }}
        >
          Start Game
        </button>
      )}
      {mines && <GameBoard />}
    </div>
  );
};

export default GamePage;
