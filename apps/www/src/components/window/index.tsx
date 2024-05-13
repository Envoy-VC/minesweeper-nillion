import Image from 'next/image';

import React, { type PropsWithChildren } from 'react';

import { Logo } from '~/assets';

import { AppWindow, X } from 'lucide-react';

interface Props extends PropsWithChildren {}

const GameWindow = ({ children }: Props) => {
  return (
    <div className='flex h-fit w-fit flex-col rounded-md'>
      <div className='w-full rounded-t-lg bg-gradient-to-b from-[#2086FF]  via-[#0055E5]  to-[#0660F0] p-2'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <Image
              src={Logo as unknown as string}
              alt='Logo'
              width={20}
              height={20}
            />
            <div className='text-base font-medium tracking-wider text-neutral-300'>
              Minesweeper
            </div>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <div className='flex h-6 w-6 cursor-pointer items-start justify-start rounded-md border text-start text-lg'>
              <div className='-my-1 mx-1 text-3xl font-medium text-white'>
                -
              </div>
            </div>
            <div className='flex h-6 w-6 cursor-pointer items-start justify-start rounded-md border bg-[#2e61b3]'>
              <div className='flex h-full w-full items-center justify-center'>
                <AppWindow size={12} className='text-white' strokeWidth={2} />
              </div>
            </div>
            <div className='flex h-6 w-6 cursor-pointer items-start justify-start rounded-md border bg-red-500'>
              <div className='flex h-full w-full items-center justify-center'>
                <X size={16} className='text-white' strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-full w-full rounded-b-sm border-4 border-t-0 border-[#0055E4] bg-[#0055E4]'>
        <div className='h-full w-full rounded-[2px] bg-[#C0C0C0]'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameWindow;
