export type Creator = {
  slug: string;
  name: string;
  bio?: string;
  avatarUrl: string;
  category: "Art" | "Music" | "Dev" | "Gaming" | "Photography" | "Podcast" | "Writing" | "Fitness" | "Fashion" | "Cooking" | "Travel" | "Education" | "Wellness" | "Other";
  payoutAddress: string;
  suggestedAmounts: number[];
  socials?: {
    x?: string;
    farcaster?: string;
    website?: string;
  };
  metrics: {
    totalTipsUSD: number;
    supporters: number;
  };
  ownerAddress: string;
  createdAt: string;
  updatedAt?: string;
};

export type OnChainCreator = {
  wallet: string;
  name: string;
  bio: string;
  avatar: string;
  isActive: boolean;
  totalTipsReceived: bigint;
  supporterCount: bigint;
};

export type ContractStats = {
  totalCreators: bigint;
  totalTips: bigint;
  totalSupporters: bigint;
};