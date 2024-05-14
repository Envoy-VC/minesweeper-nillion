'use client';

import Image from 'next/image';

import React from 'react';

import { getRandomMineLocations } from '~/lib/helpers';
import { useGame } from '~/lib/hooks';

import { useMap } from 'usehooks-ts';
import { useCopyToClipboard } from 'usehooks-ts';
import { TILES } from '~/assets';

import { AlertDialog, AlertDialogContent } from '~/components/ui/alert-dialog';

import { Shuffle } from 'lucide-react';
import { Copy } from 'lucide-react';

import type { JsInput } from '~/types/nillion';

const BOARD_ROWS = 24;
const BOARD_COLS = 24;
const MINES_COUNT = 24;

const CreateBoard = () => {
  const [, copy] = useCopyToClipboard();
  const { storeBoard } = useGame();

  const [storeId, setStoreId] = React.useState<string | null>('');
  const [status, setStatus] = React.useState<
    'idle' | 'creating' | 'success' | 'error'
  >('idle');

  const [remaining, setRemaining] = React.useState(MINES_COUNT);
  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mines, actions] = useMap<string, boolean>();

  const onCreate = async () => {
    try {
      if (status === 'success') {
        setStoreId(null);
        setStatus('idle');
        setRemaining(MINES_COUNT);
        actions.reset();
        return;
      }
      setStatus('creating');
      if (remaining > 0) {
        throw new Error('Please place all mines before creating the board.');
      }

      const minesArr: { row: string; column: string }[] = [];
      const nillionInput: JsInput[] = [];
      mines.forEach((v, k) => {
        if (v) {
          const [r, c] = k.split('-') as [string, string];
          minesArr.push({ row: r, column: c });
        }
      });
      minesArr.forEach((mine, index) => {
        nillionInput.push({
          name: `mine-x-${index}`,
          value: String(parseInt(mine.row) + 1),
        });
        nillionInput.push({
          name: `mine-y-${index}`,
          value: String(parseInt(mine.column) + 1),
        });
      });

      const store_id = await storeBoard(nillionInput);
      if (store_id) setStoreId(store_id);
      else throw new Error('Error storing mines');

      setStatus('success');
    } catch (error) {
      setStatus('error');
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
      <div className='relative flex flex-col items-center justify-center gap-1'>
        <div className='absolute right-0 top-1/2 -translate-y-1/2'>
          <div className='title-bar-controls'>
            <button
              className='m-0 h-5 w-5 p-0'
              onClick={() => {
                const mines = getRandomMineLocations();
                actions.reset();
                setRemaining(0);
                mines.forEach((mine) => actions.set(mine, true));
              }}
            >
              <Shuffle className='mx-auto text-black' size={12} />
            </button>
          </div>
        </div>
        <button
          className='mx-auto w-fit px-4 py-1 text-base font-medium'
          onClick={onCreate}
          disabled={status === 'creating'}
        >
          {(status === 'idle' || status === 'error') && 'Create'}
          {status === 'creating' && 'Creating...'}
          {status === 'success' && `Reset Board`}
        </button>
        {storeId && (
          <div className='flex flex-row items-center gap-2'>
            <span className='text-lg'>
              Game ID: <span className='font-medium'>{storeId}</span>
            </span>
            <div className='title-bar-controls'>
              <button className='m-0 h-5 w-5 p-0' onClick={() => copy(storeId)}>
                <Copy className='mx-auto text-black' size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

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
