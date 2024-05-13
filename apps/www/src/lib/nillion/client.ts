import * as nillion from '@nillion/nillion-client-js-browser/nillion_client_js_browser.js';
import {
  NillionClient,
  NodeKey,
  UserKey,
} from '@nillion/nillion-client-js-browser/nillion_client_js_browser.js';

import { nillionConfig } from './config';

import type { PaymentsConfig } from '~/types/nillion';

export const initializeNillionClient = (
  userkey: any,
  nodekey: any,
  websockets: string[],
  payments_config: PaymentsConfig
): NillionClient => {
  const client = new NillionClient(
    userkey,
    nodekey,
    websockets,
    payments_config
  );

  return client;
};

export const getNillionClient = async (userKey: string) => {
  await nillion.default();
  const nillionUserKey = UserKey.from_base58(userKey);

  // temporary fix for an issue where nodekey cannot be reused between calls
  const wl = process.env.NEXT_PUBLIC_NILLION_NODEKEY_ALLOWLISTED_SEED
    ? process.env.NEXT_PUBLIC_NILLION_NODEKEY_ALLOWLISTED_SEED.split(', ')
    : [`scaffold-eth-${Math.floor(Math.random() * 10000)}`];
  const randomElement = wl[Math.floor(Math.random() * wl.length)];
  const nodeKey = NodeKey.from_seed(randomElement ?? '');

  const client = initializeNillionClient(
    nillionUserKey,
    nodeKey,
    nillionConfig.websockets as string[],
    nillionConfig.payments_config as PaymentsConfig
  );
  return {
    nillion,
    nillionClient: client,
  };
};
