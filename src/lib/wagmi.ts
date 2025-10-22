import { http, createConfig, fallback } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      http('https://base-sepolia-rpc.publicnode.com'),
      http('https://1rpc.io/base-sepolia'),
      http('https://base-sepolia.blockpi.network/v1/rpc/public'),
      http('https://sepolia.base.org'),
    ]),
  },
  multiInjectedProviderDiscovery: true,
});