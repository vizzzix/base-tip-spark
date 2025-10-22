import { useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDR, APP_CHAIN_ID } from '@/lib/config';
import { BASETIP_ABI } from '@/lib/abi';
import { cacheCreator, cacheSlugMapping } from '@/lib/db';
import { formatUnits } from 'viem';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function useRealTimeUpdates() {
  const publicClient = usePublicClient({ chainId: APP_CHAIN_ID });
  const queryClient = useQueryClient();
  const isListening = useRef(false);

  useEffect(() => {
    if (!publicClient || isListening.current) return;

    console.log('Starting real-time event listener for CreatorRegistered events');

    const unwatch = publicClient.watchContractEvent({
      address: CONTRACT_ADDR as `0x${string}`,
      abi: BASETIP_ABI,
      eventName: 'CreatorRegistered',
      onLogs: async (logs) => {
        console.log('New CreatorRegistered event detected:', logs);

        for (const log of logs) {
          try {
            const { args } = log;
            if (!args) continue;

            const creatorAddress = args.creator as string;
            const creatorName = args.name as string;

            console.log('Processing new creator:', creatorName, 'at', creatorAddress);

            // Fetch creator data from contract
            const creatorData = await publicClient.readContract({
              address: CONTRACT_ADDR as `0x${string}`,
              abi: BASETIP_ABI,
              functionName: 'getCreator',
              args: [creatorAddress],
            });

            const [
              wallet,
              name,
              bio,
              avatar,
              isActive,
              totalTipsReceived,
              supporterCount
            ] = creatorData as [
              string,
              string,
              string,
              string,
              boolean,
              bigint,
              bigint
            ];

            const slug = name.toLowerCase().replace(/\s+/g, '-');

            // Create creator object
            const newCreator = {
              wallet,
              name,
              bio,
              avatar,
              isActive,
              totalTipsReceived,
              supporterCount,
              totalTipsUSD: Number(formatUnits(totalTipsReceived, 6)),
              supporters: Number(supporterCount),
              slug,
              category: 'Other',
              suggestedAmounts: [5, 10, 25, 50],
              payoutAddress: creatorAddress,
              ownerAddress: creatorAddress,
              createdAt: new Date().toISOString(),
            };

            // Cache the new creator
            await cacheCreator(newCreator);
            await cacheSlugMapping(slug, creatorAddress, name);

            // Invalidate and refetch queries
            queryClient.invalidateQueries({ queryKey: ['allCreators'] });
            queryClient.invalidateQueries({ queryKey: ['globalStats'] });

            // Show toast notification
            toast.success(`🎉 New creator registered: ${name}`, {
              description: 'They just joined BaseTip!',
              duration: 5000,
            });

            console.log('Successfully processed new creator:', name);
          } catch (error) {
            console.error('Error processing new creator event:', error);
            toast.error('Failed to process new creator registration');
          }
        }
      },
    });

    isListening.current = true;

    return () => {
      console.log('Stopping real-time event listener');
      unwatch();
      isListening.current = false;
    };
  }, [publicClient, queryClient]);

  return {
    isListening: isListening.current,
  };
}
