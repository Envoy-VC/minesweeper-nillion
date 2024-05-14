import React from 'react';

import { compute, storeMines } from '../nillion';
import useNillion from './useNillion';

import type { JsInput } from '~/types/nillion';

const useGame = () => {
  const { nillion, client, program_id } = useNillion();

  const storeBoard = async (mines: JsInput[]) => {
    if (!program_id) return;
    const res = await storeMines(nillion, client, mines, program_id);
    return res;
  };

  const makeMove = async (mines: JsInput[]) => {
    if (!program_id) return;
    const res = await compute(nillion, client, [], program_id);
  };

  return { storeBoard, makeMove };
};

export default useGame;
