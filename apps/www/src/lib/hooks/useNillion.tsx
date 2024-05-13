import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getNillionClient, storeProgram } from '../nillion';

const useNillion = () => {
  const {
    data,
    status: connectionStatus,
    refetch,
  } = useQuery({
    queryKey: ['nillion_snap'],
    enabled: false,
    queryFn: async () => {
      const data = await connectAsync();

      if (data.user_key) {
        const { nillion, nillionClient } = await getNillionClient(
          data.user_key
        );

        const programId = await storeProgram(nillionClient, 'main');

        return {
          programId,
          nillion,
          nillionClient,
          user_key: data.user_key,
        };
      }
    },
  });
  const connectAsync = async () => {
    try {
      const nillionSnapId = 'npm:nillion-user-key-manager';
      if (window.ethereum) {
        await window.ethereum?.request({
          method: 'wallet_requestSnaps',
          params: {
            [nillionSnapId]: {},
          },
        });

        const response: { user_key: string } | undefined =
          await window.ethereum?.request({
            method: 'wallet_invokeSnap',
            params: {
              snapId: nillionSnapId,
              request: { method: 'read_user_key' },
            },
          });

        return {
          user_key: response?.user_key,
          connectedToSnap: true,
          message: '',
        };
      } else {
        return {
          user_key: undefined,
          connectedToSnap: false,
          message: 'No Ethereum provider found',
        };
      }
    } catch (error) {
      console.error('Error interacting with Snap:', error);
      return {
        user_key: undefined,
        connectedToSnap: false,
        message: (error as Error).message,
      };
    }
  };

  return {
    userKey: data?.user_key,
    connectionStatus,
    connectAsync: refetch,
    nillion: data?.nillion,
    client: data?.nillionClient,
    program_id: data?.programId,
  };
};

export default useNillion;
