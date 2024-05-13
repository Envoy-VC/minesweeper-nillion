import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import { BackgroundImage } from '~/assets';

import GameWindow from '~/components/window';

const Template = ({ children }: PropsWithChildren) => {
  return (
    <div className='relative h-screen'>
      <Image
        src={BackgroundImage}
        alt='Background Image'
        className='absolute right-0 top-0 z-[-1] h-full w-full object-cover'
      />
      <div className='flex h-full items-center justify-center'>
        <GameWindow>{children}</GameWindow>
      </div>
    </div>
  );
};

export default Template;
