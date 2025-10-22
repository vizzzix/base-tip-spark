import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDR, APP_CHAIN_ID } from '@/lib/config';
import { parseAbiItem } from 'viem';

export interface DonorStats {
  totalDonated: number;
  totalDonations: number;
  topCreator: string;
  lastDonation: Date | null;
  badges: string[];
}

export function useDonorStats() {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: APP_CHAIN_ID });

  return useQuery({
    queryKey: ['donorStats', address],
    queryFn: async (): Promise<DonorStats> => {
      if (!address || !publicClient) {
        return {
          totalDonated: 0,
          totalDonations: 0,
          topCreator: '',
          lastDonation: null,
          badges: []
        };
      }

      try {
        // Get current block number to limit the range
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n;

        console.log(`Fetching tip events for donor ${address} from block ${fromBlock} to ${currentBlock}`);

        // Get TipSent events where the sender is our address
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDR as `0x${string}`,
          event: parseAbiItem("event TipSent(address indexed from, address indexed to, uint256 amount, string memo)"),
          fromBlock,
          toBlock: currentBlock,
          args: {
            from: address
          }
        });

        console.log(`Found ${logs.length} tip events for donor ${address}`);

        // Process the logs to calculate stats
        let totalDonated = 0;
        const creatorDonations: { [key: string]: number } = {};
        let lastDonation: Date | null = null;

        for (const log of logs) {
          const amount = Number(log.args.amount) / 1e6; // Convert from wei to USDC (6 decimals)
          const to = log.args.to as string;
          
          totalDonated += amount;
          creatorDonations[to] = (creatorDonations[to] || 0) + amount;
          
          // Get block timestamp for last donation
          try {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const donationDate = new Date(Number(block.timestamp) * 1000);
            if (!lastDonation || donationDate > lastDonation) {
              lastDonation = donationDate;
            }
          } catch (error) {
            console.warn('Failed to get block timestamp:', error);
          }
        }

        // Find top creator
        const topCreator = Object.entries(creatorDonations)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

        // Calculate badges based on total donated
        const badges = calculateBadges(totalDonated);

        return {
          totalDonated,
          totalDonations: logs.length,
          topCreator,
          lastDonation,
          badges
        };
      } catch (error) {
        console.error('Error fetching donor stats:', error);
        return {
          totalDonated: 0,
          totalDonations: 0,
          topCreator: '',
          lastDonation: null,
          badges: []
        };
      }
    },
    enabled: !!address && !!publicClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

function calculateBadges(totalDonated: number): string[] {
  const badges: string[] = [];
  
  if (totalDonated >= 0) badges.push('Supporter');
  if (totalDonated >= 500) badges.push('Fan');
  if (totalDonated >= 2000) badges.push('VIP');
  if (totalDonated >= 5000) badges.push('Champion');
  if (totalDonated >= 10000) badges.push('Legend');
  if (totalDonated >= 25000) badges.push('Diamond');
  
  return badges;
}
