'use client';

import Image from 'next/image';

import React from 'react';

import {
  getMinesInputs,
  getTileImage,
  getTilesLeft,
  getUpdatedBoard,
} from '~/lib/helpers';
import { useGame } from '~/lib/hooks';
import { useGameStore } from '~/lib/stores';
import { cn } from '~/lib/utils';

import { GameLost, Smiley } from '~/assets';
import { TILES } from '~/assets';
import { TILE_TYPE } from '~/types';

import { AlertDialog, AlertDialogContent } from '~/components/ui/alert-dialog';

import DigitalDisplay from './DigitalDisplay';

import type { JsInput } from '~/types/nillion';

interface Props {
  mines: [number, number][];
}

const GameBoard = ({ mines }: Props) => {
  const {
    board,
    gameLost,
    gameEnded,
    tilesLeft,
    currentMoveCount,
    flags,
    setFlag,
    setResult,
    setBoard,
    setTile,
    setTilesLeft,
    incMoves,
    reset,
  } = useGameStore();
  const { makeMove } = useGame();

  const [open, setOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const play = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: TILE_TYPE,
    row: number,
    col: number
  ) => {
    try {
      if (gameLost || gameEnded) throw new Error('Game has ended');

      // FLAG Handlers
      if (e.altKey) {
        if (type === TILE_TYPE.FLAG) {
          setFlag(`${row}-${col}`);
        } else if (type === TILE_TYPE.UNTOUCHED) {
          setFlag(`${row}-${col}`);
        }
      } else {
        if (type !== TILE_TYPE.UNTOUCHED) throw new Error('Invalid move');
        const inputs: JsInput[] = [];
        const minesInputs = getMinesInputs(mines);
        inputs.push(...minesInputs);
        inputs.push({
          name: `location-0`,
          value: String(row + 1),
        });
        inputs.push({
          name: `location-1`,
          value: String(col + 1),
        });
        const res = await makeMove(inputs);
        if (!res) throw new Error('Error making move');
        if (res.game_over === '1') {
          setTile(TILE_TYPE.RED_MINE, row, col);
          setResult(true, true);
          setOpen(true);
          setError('Game Over');
        } else {
          const updated = getUpdatedBoard(board, [row, col], mines);
          const tilesLeft = getTilesLeft(updated);
          if (tilesLeft === 0) {
            setResult(true, false);
            setOpen(true);
            setError('You won!');
          }
          setTilesLeft(tilesLeft);
          incMoves();
          setBoard(updated);
        }
      }
    } catch (error) {
      setError((error as Error).message);
      setOpen(true);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative flex items-center justify-center'>
        <div className='absolute left-0 top-1/2 -translate-y-1/2 '>
          <DigitalDisplay text={tilesLeft} />
        </div>
        <Image
          src={gameLost ? GameLost : Smiley}
          alt='Game Lost'
          className='h-12 w-12 object-cover'
        />
        <div className='absolute right-0 top-1/2 -translate-y-1/2 '>
          <DigitalDisplay text={currentMoveCount} />
        </div>
      </div>
      <div className='relative'>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className='flex'>
            {row.map((_, colIdx) => {
              const type = _;
              const key = `${rowIdx}-${colIdx}`;
              const isFlag = flags.includes(key);
              const canPlay =
                (type === TILE_TYPE.UNTOUCHED || type === TILE_TYPE.FLAG) &&
                !gameEnded;
              return (
                <div
                  className={cn(
                    canPlay ? 'cursor-pointer' : 'cursor-not-allowed'
                  )}
                  key={`tile-${key}`}
                  onClick={async (e) => {
                    await play(e, type, rowIdx, colIdx);
                  }}
                >
                  <Image
                    src={getTileImage(_, isFlag)}
                    alt='Tile'
                    className='pointer-events-none h-[24px] w-[24px]'
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <div className='mx-auto flex flex-row items-center gap-3 text-base font-medium'>
          OPTION/ALT + CLICK TO{' '}
          <Image src={TILES.flag} alt='Flag' className='h-6 w-6 object-cover' />
        </div>
        {gameEnded && (
          <button
            className='mx-auto w-fit px-4 py-1 text-base font-medium'
            onClick={reset}
          >
            Restart Game
          </button>
        )}
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className='!m-0 !rounded-none !p-0 !text-base !tracking-wider'>
          <div className='window'>
            <div className='title-bar'>
              <div className='title-bar-text px-2 text-base tracking-wider'>
                Message
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

export default GameBoard;
