import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_ADDR, APP_CHAIN_ID } from '@/lib/config';
import { parseAbiItem } from 'viem';
import { cacheCreators, getCachedCreators } from '@/lib/db';

export interface CreatorFromEvent {
  address: string;
  name: string;
  bio: string;
  avatar: string;
  slug: string;
}

export function useCreatorEvents() {
  const publicClient = usePublicClient({ chainId: APP_CHAIN_ID });

  return useQuery({
    queryKey: ['creatorEvents'],
    queryFn: async (): Promise<CreatorFromEvent[]> => {
      if (!publicClient) {
        throw new Error('Public client not available');
      }

      try {
        // Get current block number to limit the range
        const currentBlock = await publicClient.getBlockNumber();
        // Start from 10,000 blocks ago (approximately 2-3 days) to avoid 503 errors
        const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n;
        
        console.log(`Fetching CreatorRegistered events from block ${fromBlock} to ${currentBlock}`);
        
        // Get CreatorRegistered events from the contract
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDR as `0x${string}`,
          event: parseAbiItem("event CreatorRegistered(address indexed creator, string name)"),
          fromBlock,
          toBlock: currentBlock,
        });

        console.log(`Found ${logs.length} CreatorRegistered events`);

        // Transform logs into creator objects
        const creators: CreatorFromEvent[] = logs.map((log, index) => {
          const address = log.args.creator as string;
          const name = log.args.name as string;
          const slug = name.toLowerCase().replace(/\s+/g, '-');
          
          return {
            address,
            name,
            bio: `Creator on Base`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            slug,
          };
        });

        // Cache the creators in IndexedDB
        if (creators.length > 0) {
          const creatorsForCache = creators.map(creator => ({
            wallet: creator.address,
            name: creator.name,
            bio: creator.bio,
            avatar: creator.avatar,
            isActive: true,
            totalTipsReceived: BigInt(0),
            supporterCount: BigInt(0),
            totalTipsUSD: 0,
            supporters: 0,
            slug: creator.slug,
            category: 'Other',
            suggestedAmounts: [5, 10, 25, 50],
            payoutAddress: creator.address,
            ownerAddress: creator.address,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

          await cacheCreators(creatorsForCache);
        }

        return creators;
      } catch (error) {
        console.error('Error fetching creator events:', error);
        
        // If it's a 503 error, try to get cached data as fallback
        if (error instanceof Error && error.message.includes('503')) {
          console.log('503 error detected, trying to load from cache...');
          try {
            const cached = await getCachedCreators();
            if (cached.length > 0) {
              console.log(`Loaded ${cached.length} creators from cache as fallback`);
              console.log('Cached creators:', cached.map(c => ({ name: c.name, slug: c.slug, isDemo: c.slug?.startsWith('demo-') })));
              return cached.map(creator => ({
                address: creator.wallet,
                name: creator.name,
                bio: creator.bio,
                avatar: creator.avatar,
                slug: creator.slug,
              }));
            }
          } catch (cacheError) {
            console.warn('Failed to load from cache:', cacheError);
          }
        }
        
        throw error;
      }
    },
    enabled: !!publicClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 503 errors as they're likely to fail again
      if (error instanceof Error && error.message.includes('503')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
