// Base Sepolia configuration
export const APP_CHAIN_ID = 84532;
export const CONTRACT_ADDRESS = "0x602306cE966CB42FA39f6463cb401e8aF1080eBD";
export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

// Environment overrides
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID ? parseInt(import.meta.env.VITE_CHAIN_ID) : APP_CHAIN_ID;
export const CONTRACT_ADDR = import.meta.env.VITE_CONTRACT_ADDRESS || CONTRACT_ADDRESS;
export const USDC_ADDR = import.meta.env.VITE_USDC_ADDRESS || USDC_ADDRESS;

// BaseScan URL helper
export const BASESCAN_TX = (hash: string) => `https://base-sepolia.blockscout.com/tx/${hash}`;

// App configuration
export const APP_NAME = "BaseTip";
export const APP_DESCRIPTION = "On-chain tipping platform for creators on Base";
export const FEE_PERCENTAGE = 0.5; // 0.5% fee
export const CREATOR_RECEIVES_PERCENTAGE = 99.5; // 99.5% goes to creator