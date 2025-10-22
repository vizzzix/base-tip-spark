import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_CHAIN_ID } from '@/lib/config';

export function NetworkChip() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { isConnected } = useAccount();

  const isCorrectChain = chainId === APP_CHAIN_ID;

  if (!isConnected) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
        Not Connected
      </Badge>
    );
  }

  if (isCorrectChain) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
        Base Sepolia
      </Badge>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => switchChain({ chainId: APP_CHAIN_ID })}
      disabled={isPending}
      className="text-sm"
    >
      {isPending ? 'Switching...' : 'Switch to Base Sepolia'}
    </Button>
  );
}
