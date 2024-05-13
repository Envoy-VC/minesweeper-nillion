'use client';

import React, { useMemo } from 'react';

import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import BigNumber from 'bignumber.js';
import {
  useAccount,
  useBalance,
  useChains,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';

import { Button } from '~/components/ui/button';

import { Skeleton } from '../ui/skeleton';

const ConnectButton = () => {
  const { address } = useAccount();
  const chains = useChains();

  const { open } = useWeb3Modal();
  const { open: isOpen, selectedNetworkId } = useWeb3ModalState();

  // Balance
  const { data: balance, status: balanceStatus } = useBalance({
    address,
  });

  // ENS
  const { data: ensName, status: ensNameStatus } = useEnsName({
    address,
  });
  const { data: ensAvatar, status: ensAvatarStatus } = useEnsAvatar({
    name: ensName ?? '',
    query: {
      enabled: ensName !== null,
      initialData: `https://api.dicebear.com/8.x/shapes/svg?seed=${address}`,
    },
  });

  const chainIds = useMemo(() => chains.map((c) => c.id), [chains]);
  const activeChainId = useMemo(
    () => parseInt(selectedNetworkId ?? '1'),
    [selectedNetworkId]
  );
  const currencySymbol = useMemo(
    () =>
      chains.find((c) => c.id === activeChainId)?.nativeCurrency.symbol ?? '',
    [chains, activeChainId]
  );

  const formattedBalance = useMemo(() => {
    if (balanceStatus === 'success') {
      return BigNumber(Number(balance?.value ?? 0))
        .dividedBy(10 ** (balance?.decimals ?? 18))
        .toFixed(4);
    }
    return '';
  }, [balance, balanceStatus]);

  const formattedAddress = useMemo(() => {
    if (address) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
    }
    return '';
  }, [address]);

  if (!address) {
    return (
      <Button
        className='rounded-full'
        onClick={() =>
          open({
            view: 'Connect',
          })
        }
      >
        {isOpen ? 'Connecting...' : 'Connect'}
      </Button>
    );
  } else if (address && !chainIds.includes(activeChainId)) {
    return (
      <Button
        className='rounded-full'
        onClick={() =>
          open({
            view: 'Networks',
          })
        }
      >
        Switch Network
      </Button>
    );
  } else if (address && chainIds.includes(activeChainId)) {
    return (
      <Button
        className='h-12 rounded-xl'
        variant='outline'
        onClick={() =>
          open({
            view: 'Account',
          })
        }
      >
        <div className='flex flex-row items-center gap-3'>
          {ensAvatarStatus === 'pending' ? (
            <Skeleton className='h-9 w-9 rounded-full' />
          ) : (
            <img
              src={
                ensAvatar ??
                `https://api.dicebear.com/8.x/shapes/svg?seed=${address}`
              }
              alt=''
              className='h-9 w-9 rounded-full'
            />
          )}
          <div className='flex flex-col items-start'>
            <div className='font-semibold'>
              {ensNameStatus === 'success' ? (
                ensName ?? formattedAddress
              ) : (
                <Skeleton className='h-4 w-24' />
              )}
            </div>
            <div className='text-xs font-medium text-neutral-600'>
              {balanceStatus === 'success' ? (
                <>
                  {formattedBalance} {currencySymbol}
                </>
              ) : (
                <Skeleton className='h-3 w-16 pt-[2px]' />
              )}
            </div>
          </div>
        </div>
      </Button>
    );
  }
};

export default ConnectButton;
