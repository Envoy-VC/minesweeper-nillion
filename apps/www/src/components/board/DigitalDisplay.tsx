import localFont from 'next/font/local';

import React, { type ComponentProps } from 'react';

import { cn } from '~/lib/utils';

export const digital = localFont({
  src: '../../../public/fonts/digital.ttf',
  variable: '--font-digital',
});

interface Props extends ComponentProps<'div'> {
  text: string[];
}

const DigitalDisplay = ({ text, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'z-[-1] flex w-[120px] flex-row items-center border-2 border-[#e5e5e5] bg-[#010000] pr-1 text-[3.5rem] leading-[1.02] text-[#FF0000] shadow-md',
        digital.className,
        className
      )}
      {...props}
    >
      <div className='relative h-full w-full basis-1/3'>
        <div className='flex h-full w-full items-center justify-center text-[#2E0001]'>
          0
        </div>
        <div className='absolute top-0 flex h-full w-full items-center justify-end px-1'>
          {text[0]}
        </div>
      </div>
      <div className='relative h-full w-full basis-1/3'>
        <div className='flex h-full w-full items-center justify-center text-[#2E0001]'>
          0
        </div>
        <div className='absolute top-0 flex h-full w-full items-center justify-end px-1'>
          {text[1]}
        </div>
      </div>
      <div className='relative h-full w-full basis-1/3'>
        <div className='flex h-full w-full items-center justify-center text-[#2E0001]'>
          0
        </div>
        <div className='absolute top-0 flex h-full w-full items-center justify-end px-1'>
          {text[2]}
        </div>
      </div>
    </div>
  );
};

export default DigitalDisplay;
