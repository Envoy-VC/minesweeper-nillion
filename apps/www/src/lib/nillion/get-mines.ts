'use client';

import { UserKey } from '@nillion/nillion-client-js-browser';

import { getNillionClient } from './client';
import { nillionConfig } from './config';

const getMines = async (store_id: string) => {
  const admin = UserKey.from_seed('admin');
  const libraries = await getNillionClient(admin.to_base58());
  const nillionClient = libraries.nillionClient;

  const mines: [number, number][] = [];
  for (let i = 0; i < 24; i++) {
    const mineX = (
      await nillionClient.retrieve_secret(
        nillionConfig.cluster_id,
        store_id,
        `mine-x-${i}`
      )
    ).to_integer();

    const mineY = (
      await nillionClient.retrieve_secret(
        nillionConfig.cluster_id,
        store_id,
        `mine-y-${i}`
      )
    ).to_integer();

    mines.push([parseInt(mineX), parseInt(mineY)]);
  }
  return mines;
};

export default getMines;
