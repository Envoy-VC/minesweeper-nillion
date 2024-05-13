'use client';

import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

import { LogoText } from '~/assets';

import { ArrowRight } from 'lucide-react';

const HomeSection = () => {
  const [joinStatus, setJoinStatus] = React.useState<
    'idle' | 'active' | 'joining'
  >('idle');

  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-12'>
      <Image
        src={LogoText as unknown as string}
        alt='Logo'
        className='w-full max-w-sm object-cover'
      />
      <div className='flex w-full max-w-[14rem] flex-col gap-3 py-12'>
        <Link href='/create' className='w-full'>
          <button className='w-full px-6 py-1 text-base font-medium'>
            Create Game
          </button>
        </Link>
        <button
          className='px-6 py-1 text-base font-medium'
          onClick={() => {
            setJoinStatus('active');
          }}
        >
          Join Game
        </button>
        {joinStatus === 'active' && (
          <div className='flex flex-col gap-1'>
            <div
              className='text-center'
              style={{
                fontFamily: 'Pixelated MS Sans Serif',
              }}
            >
              Game ID
            </div>
            <div className='flex flex-row items-center gap-2'>
              <input
                id='text17'
                type='text'
                className='!h-6 w-full text-base'
              />
              <div className='title-bar-controls'>
                <button className='m-0 h-5 w-5 p-0'>
                  <ArrowRight className='mx-auto text-black' size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSection;
