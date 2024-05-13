import React from 'react';

import { CreateBoard } from '~/components';

const Create = () => {
  return (
    <div className='flex flex-col items-center gap-4 px-4 py-6'>
      <div className='w-full text-center text-lg'>Place Mines</div>
      <CreateBoard />
    </div>
  );
};

export default Create;
