import { Creator } from './types';

const STORAGE_KEY = 'basetip.creators';

export const saveCreator = (creator: Creator) => {
  const creators = getCreators();
  const existing = creators.findIndex((c) => c.slug === creator.slug);
  
  if (existing >= 0) {
    creators[existing] = creator;
  } else {
    creators.push(creator);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creators));
};

export const getCreator = (slug: string): Creator | null => {
  const creators = getCreators();
  return creators.find((c) => c.slug === slug) || null;
};

export const getCreators = (): Creator[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteCreator = (slug: string) => {
  const creators = getCreators().filter((c) => c.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creators));
};

// Mock featured creators for demo
export const MOCK_FEATURED_CREATORS: Creator[] = [
  {
    slug: 'alice-music',
    name: 'Alice',
    bio: 'Creating beautiful music on-chain',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    category: 'Music',
    payoutAddress: '0x0000000000000000000000000000000000000001',
    suggestedAmounts: [1, 5, 10],
    socials: { twitter: 'alice' },
    metrics: { totalTipsUSD: 1200, supporters: 87 },
    ownerAddress: '0x0000000000000000000000000000000000000001',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    slug: 'bob-dev',
    name: 'Bob',
    bio: 'Building open-source tools for Base',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    category: 'Development',
    payoutAddress: '0x0000000000000000000000000000000000000002',
    suggestedAmounts: [5, 10, 25],
    socials: { github: 'bob' },
    metrics: { totalTipsUSD: 850, supporters: 64 },
    ownerAddress: '0x0000000000000000000000000000000000000002',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    slug: 'carol-art',
    name: 'Carol',
    bio: 'Digital artist exploring NFT culture',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    category: 'Art',
    payoutAddress: '0x0000000000000000000000000000000000000003',
    suggestedAmounts: [1, 5, 10],
    socials: { website: 'carol.art' },
    metrics: { totalTipsUSD: 650, supporters: 52 },
    ownerAddress: '0x0000000000000000000000000000000000000003',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    slug: 'david-content',
    name: 'David',
    bio: 'Web3 educator and content creator',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    category: 'Education',
    payoutAddress: '0x0000000000000000000000000000000000000004',
    suggestedAmounts: [5, 10, 20],
    socials: { twitter: 'davidweb3', website: 'davidteaches.xyz' },
    metrics: { totalTipsUSD: 580, supporters: 45 },
    ownerAddress: '0x0000000000000000000000000000000000000004',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    slug: 'emma-gaming',
    name: 'Emma',
    bio: 'Streaming Base blockchain games',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    category: 'Gaming',
    payoutAddress: '0x0000000000000000000000000000000000000005',
    suggestedAmounts: [1, 5, 10],
    socials: { twitter: 'emmagames' },
    metrics: { totalTipsUSD: 420, supporters: 38 },
    ownerAddress: '0x0000000000000000000000000000000000000005',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    slug: 'frank-defi',
    name: 'Frank',
    bio: 'DeFi researcher and analyst',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank',
    category: 'Finance',
    payoutAddress: '0x0000000000000000000000000000000000000006',
    suggestedAmounts: [10, 25, 50],
    socials: { twitter: 'frankdefi', github: 'frankresearch' },
    metrics: { totalTipsUSD: 720, supporters: 56 },
    ownerAddress: '0x0000000000000000000000000000000000000006',
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    slug: 'grace-design',
    name: 'Grace',
    bio: 'UI/UX designer for Web3 projects',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
    category: 'Design',
    payoutAddress: '0x0000000000000000000000000000000000000007',
    suggestedAmounts: [5, 10, 15],
    socials: { twitter: 'gracedesigns', website: 'graceuxui.com' },
    metrics: { totalTipsUSD: 490, supporters: 41 },
    ownerAddress: '0x0000000000000000000000000000000000000007',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    slug: 'henry-podcaster',
    name: 'Henry',
    bio: 'Hosting Web3 podcast weekly',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry',
    category: 'Media',
    payoutAddress: '0x0000000000000000000000000000000000000008',
    suggestedAmounts: [5, 10, 20],
    socials: { twitter: 'henrypodcast', website: 'web3talks.fm' },
    metrics: { totalTipsUSD: 380, supporters: 33 },
    ownerAddress: '0x0000000000000000000000000000000000000008',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    slug: 'iris-writer',
    name: 'Iris',
    bio: 'Writing about crypto and Base ecosystem',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris',
    category: 'Writing',
    payoutAddress: '0x0000000000000000000000000000000000000009',
    suggestedAmounts: [1, 5, 10],
    socials: { twitter: 'iriswrites', website: 'irisblockchain.blog' },
    metrics: { totalTipsUSD: 310, supporters: 28 },
    ownerAddress: '0x0000000000000000000000000000000000000009',
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    slug: 'jack-trader',
    name: 'Jack',
    bio: 'Sharing on-chain trading strategies',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    category: 'Trading',
    payoutAddress: '0x000000000000000000000000000000000000000a',
    suggestedAmounts: [10, 25, 50],
    socials: { twitter: 'jacktrades' },
    metrics: { totalTipsUSD: 540, supporters: 47 },
    ownerAddress: '0x000000000000000000000000000000000000000a',
    createdAt: Date.now() - 86400000 * 14,
  },
];
