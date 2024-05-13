'use client';

import Image from 'next/image';

import React from 'react';

import { useMap } from 'usehooks-ts';
import { TILES } from '~/assets';

import { AlertDialog, AlertDialogContent } from '~/components/ui/alert-dialog';

const BOARD_ROWS = 24;
const BOARD_COLS = 24;

const CreateBoard = () => {
  const [remaining, setRemaining] = React.useState(24);
  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mines, actions] = useMap<string, boolean>();

  const onCreate = () => {
    try {
      if (remaining > 0) {
        throw new Error('Please place all mines before creating the board.');
      }

      const minesArr: { row: number; column: number }[] = [];
      mines.forEach((v, k) => {
        if (v) {
          const [r, c] = k.split('-') as [string, string];
          minesArr.push({ row: parseInt(r), column: parseInt(c) });
        }
      });
      console.log(minesArr);
    } catch (error) {
      setError((error as Error).message);
      setOpen(true);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='relative'>
        <div className='absolute -top-10 right-4 text-base'>
          Remaining: {remaining}
        </div>
        {Array(BOARD_ROWS)
          .fill(true)
          .map((_, rowIdx) => (
            <div key={rowIdx} className='flex'>
              {Array(BOARD_COLS)
                .fill(true)
                .map((_, colIdx) => {
                  const key = `${rowIdx}-${colIdx}`;
                  return (
                    <div
                      className='cursor-pointer'
                      key={`tile-${key}`}
                      onClick={() => {
                        const current = mines.get(key) ?? false;
                        if (remaining === 0) {
                          if (current) {
                            setRemaining((prev) => prev + 1);
                            actions.set(key, !current);
                            return;
                          } else {
                            return;
                          }
                        }

                        if (current) {
                          setRemaining((prev) => prev + 1);
                        } else {
                          setRemaining((prev) => prev - 1);
                        }
                        actions.set(key, !current);
                      }}
                    >
                      <Image
                        src={mines.get(key) ? TILES.mine : TILES.default}
                        alt='Default Tile'
                        className='h-[24px] w-[24px]'
                      />
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
      <button
        className='mx-auto w-fit px-4 py-1 text-base font-medium'
        onClick={onCreate}
      >
        Create
      </button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='!m-0 !rounded-none !p-0 !text-base !tracking-wider'>
          <div className='window'>
            <div className='title-bar'>
              <div className='title-bar-text px-2 text-base tracking-wider'>
                Error
              </div>
              <div className='title-bar-controls'>
                <button
                  aria-label='Close'
                  onClick={() => {
                    setOpen(false);
                    setError(null);
                  }}
                ></button>
              </div>
            </div>
            <div className='window-body text-base'>
              <p>{error}</p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateBoard;
