import React from 'react';

import { GameBoard } from '~/components';

interface Props {
  params: {
    id: string;
  };
}

const GamePage = ({ params: { id } }: Props) => {
  return (
    <div className='py-10 px-3'>
      <GameBoard />
    </div>
  );
};

export default GamePage;
