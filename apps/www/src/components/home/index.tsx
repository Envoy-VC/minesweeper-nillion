'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React from 'react';

import { useNillion } from '~/lib/hooks';

import { LogoText } from '~/assets';

import { ArrowRight } from 'lucide-react';

const HomeSection = () => {
  const router = useRouter();
  const { userKey, connectionStatus, connectAsync } = useNillion();
  const [joinStatus, setJoinStatus] = React.useState<
    'idle' | 'active' | 'joining'
  >('idle');

  const [id, setId] = React.useState<string>('');

  const onJoin = async () => {
    try {
      router.push(`/game/${id}`);
    } catch (error) {}
  };

  return (
    <div className='flex h-[24rem] w-full flex-col items-center justify-start px-12 py-24'>
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
                value={id}
                onChange={(e) => setId(e.target.value)}
                className='!h-6 w-full text-base'
              />
              <div className='title-bar-controls'>
                <button className='m-0 h-5 w-5 p-0' onClick={onJoin}>
                  <ArrowRight className='mx-auto text-black' size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          className='px-6 py-1 text-base font-medium'
          onClick={async () => {
            if (connectionStatus === 'success' && !userKey) return;
            await connectAsync();
          }}
        >
          {connectionStatus === 'success' &&
            !!userKey &&
            `Connected ${userKey.slice(0, 3)}...${userKey.slice(-3)}`}
          {!userKey && `Connect to Nillion`}
        </button>
      </div>
    </div>
  );
};

export default HomeSection;
