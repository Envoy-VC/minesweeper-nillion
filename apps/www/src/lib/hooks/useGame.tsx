import React from 'react';

import { UserKey } from '@nillion/nillion-client-js-browser';

import { compute, storeMines } from '../nillion';
import { getNillionClient } from '../nillion/client';
import useNillion from './useNillion';

import type { JsInput } from '~/types/nillion';

const useGame = () => {
  const { nillion, client, program_id } = useNillion();

  const storeBoard = async (mines: JsInput[]) => {
    if (!program_id) return;
    const admin = (
      await getNillionClient(UserKey.from_seed('admin').to_base58())
    ).nillionClient.user_id;
    const res = await storeMines(
      nillion,
      client,
      mines,
      program_id,
      [admin],
      [admin],
      [admin],
      [admin]
    );
    return res;
  };

  const makeMove = async (inputs: JsInput[]) => {
    if (!program_id) return;
    const party2 = (
      await getNillionClient(UserKey.from_seed('party2').to_base58())
    ).nillionClient.party_id;
    const res = await compute(nillion, client, [], program_id, party2, inputs);
    return res;
  };

  return { storeBoard, makeMove };
};

export default useGame;
