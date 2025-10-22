import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { APP_CHAIN_ID } from '@/lib/config';

export function NetworkWarning() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Don't show warning if not connected or on correct chain
  if (!isConnected || chainId === APP_CHAIN_ID) {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Wrong Network:</strong> You're connected to the wrong network. 
          Please switch to Base Sepolia to use BaseTip.
        </div>
        <Button
          onClick={() => switchChain({ chainId: APP_CHAIN_ID })}
          disabled={isPending}
          size="sm"
          variant="outline"
          className="ml-4 gap-2 border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          {isPending ? 'Switching...' : 'Switch Network'}
          <ExternalLink className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
