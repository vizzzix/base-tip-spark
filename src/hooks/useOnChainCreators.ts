import { useReadContract, usePublicClient } from 'wagmi';
import { CONTRACT_ADDR, APP_CHAIN_ID } from '@/lib/config';
import { BASETIP_ABI } from '@/lib/abi';
import { formatUnits } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { slugMapping } from '@/lib/slug-mapping';
import { 
  cacheCreators, 
  getCachedCreators, 
  cacheCreator, 
  getCachedCreatorBySlug,
  cacheSlugMapping,
  getCachedSlugMapping,
  cacheGlobalStats,
  getCachedGlobalStats
} from '@/lib/db';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface OnChainCreator {
  wallet: string;
  name: string;
  bio: string;
  avatar: string;
  isActive: boolean;
  totalTipsReceived: bigint;
  supporterCount: bigint;
}

export interface OnChainCreatorData extends OnChainCreator {
  totalTipsUSD: number;
  supporters: number;
  slug: string;
  category: string;
  suggestedAmounts: number[];
  socials?: {
    x?: string;
    farcaster?: string;
    website?: string;
  };
  payoutAddress: string;
  ownerAddress: string;
  createdAt: string;
  updatedAt?: string;
}

// Hook to get all creator addresses from contract
export function useAllCreatorAddresses() {
  const { data: creatorAddresses, isLoading, error } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}`,
    abi: BASETIP_ABI,
    functionName: 'getAllCreators',
    chainId: APP_CHAIN_ID,
  });

  return {
    creatorAddresses: creatorAddresses as `0x${string}`[] | undefined,
    isLoading,
    error,
  };
}

// Hook to get a single creator by address
export function useCreatorByAddress(address: `0x${string}` | undefined) {
  const { data: creatorData, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}`,
    abi: BASETIP_ABI,
    functionName: 'getCreator',
    args: address ? [address] : undefined,
    chainId: APP_CHAIN_ID,
  });

  const creator: OnChainCreator | undefined = creatorData ? {
    wallet: creatorData[0],
    name: creatorData[1],
    bio: creatorData[2],
    avatar: creatorData[3],
    isActive: creatorData[4],
    totalTipsReceived: creatorData[5],
    supporterCount: creatorData[6],
  } : undefined;

  return {
    creator,
    isLoading,
    error,
    refetch,
  };
}

// Hook to get all creators with their data
export function useAllCreators(forceRefresh = false) {
  const { creatorAddresses, isLoading: addressesLoading, error: addressesError } = useAllCreatorAddresses();
  const publicClient = usePublicClient({ chainId: APP_CHAIN_ID });
  const [isOffline, setIsOffline] = useState(false);

  return useQuery({
    queryKey: ['allCreators', creatorAddresses, forceRefresh],
    queryFn: async (): Promise<OnChainCreatorData[]> => {
      try {
        // First try to get from cache if not forcing refresh
        if (!forceRefresh) {
          const cached = await getCachedCreators();
          if (cached.length > 0) {
            return cached;
          }
        }

        if (!creatorAddresses || creatorAddresses.length === 0) {
          return [];
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        // Use multicall to fetch all creator data at once
        const calls = creatorAddresses.map((address) => ({
          address: CONTRACT_ADDR as `0x${string}`,
          abi: BASETIP_ABI,
          functionName: 'getCreator' as const,
          args: [address] as const,
        }));

        const results = await publicClient.multicall({
          contracts: calls,
        });

        const creators: OnChainCreatorData[] = [];

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const address = creatorAddresses[i];

          if (result.status === 'success' && result.result) {
            const creatorData = result.result as [
              string,
              string,
              string,
              string,
              boolean,
              bigint,
              bigint
            ];

            const slug = creatorData[1].toLowerCase().replace(/\s+/g, '-');
            
            // Update slug mapping
            slugMapping.addMapping(slug, address, creatorData[1]);
            await cacheSlugMapping(slug, address, creatorData[1]);

            const creator: OnChainCreatorData = {
              wallet: creatorData[0],
              name: creatorData[1],
              bio: creatorData[2],
              avatar: creatorData[3],
              isActive: creatorData[4],
              totalTipsReceived: creatorData[5],
              supporterCount: creatorData[6],
              totalTipsUSD: Number(formatUnits(creatorData[5], 6)),
              supporters: Number(creatorData[6]),
              slug,
              category: 'Other', // Default category since it's not stored on-chain
              suggestedAmounts: [5, 10, 25, 50], // Default suggestions
              payoutAddress: address,
              ownerAddress: address,
              createdAt: new Date().toISOString(),
            };

            creators.push(creator);
          }
        }

        // Cache the results
        await cacheCreators(creators);
        setIsOffline(false);

        return creators;
      } catch (error) {
        // Fallback to cache on error
        const cached = await getCachedCreators();
        if (cached.length > 0) {
          setIsOffline(true);
          return cached;
        }
        
        throw error;
      }
    },
    enabled: !!creatorAddresses && creatorAddresses.length > 0 && !!publicClient,
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

// Hook to get creator by slug (uses slug mapping)
export function useCreatorBySlug(slug: string) {
  const { data: allCreators, isLoading, error } = useAllCreators();

  // First try to find by slug mapping
  const mapping = slugMapping.getMappingBySlug(slug);
  const creator = mapping 
    ? allCreators?.find(c => c.wallet.toLowerCase() === mapping.address.toLowerCase())
    : allCreators?.find(c => c.slug === slug);

  return {
    creator,
    isLoading,
    error,
  };
}

// Hook to get global stats
export function useGlobalStats(forceRefresh = false) {
  const publicClient = usePublicClient({ chainId: APP_CHAIN_ID });
  const [isOffline, setIsOffline] = useState(false);

  return useQuery({
    queryKey: ['globalStats', forceRefresh],
    queryFn: async () => {
      try {
        // First try to get from cache if not forcing refresh
        if (!forceRefresh) {
          const cached = await getCachedGlobalStats();
          if (cached) {
            return cached;
          }
        }

        if (!publicClient) {
          throw new Error('Public client not available');
        }

        const stats = await publicClient.readContract({
          address: CONTRACT_ADDR as `0x${string}`,
          abi: BASETIP_ABI,
          functionName: 'getStats',
        });

        const result = {
          totalCreators: Number(stats[0]),
          totalTips: Number(formatUnits(stats[1], 6)),
          totalSupporters: Number(stats[2]),
        };

        // Cache the result
        await cacheGlobalStats(result);
        setIsOffline(false);

        return result;
      } catch (error) {
        console.error('Error fetching global stats:', error);
        
        // Fallback to cache on error
        const cached = await getCachedGlobalStats();
        if (cached) {
          setIsOffline(true);
          return cached;
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
