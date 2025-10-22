import { Creator } from './types';

const STORAGE_KEY = 'basetip.creators';

// Mock creators for initial seed
const MOCK_CREATORS: Creator[] = [
  {
    slug: 'alice-art',
    name: 'Alice Chen',
    bio: 'Digital artist creating beautiful NFTs and illustrations',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Art',
    payoutAddress: '0x1234567890123456789012345678901234567890',
    suggestedAmounts: [5, 10, 25, 50],
    socials: {
      x: 'alice_art',
      website: 'https://alice-art.com'
    },
    metrics: {
      totalTipsUSD: 1250.50,
      supporters: 45
    },
    ownerAddress: '0x1234567890123456789012345678901234567890',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'bob-music',
    name: 'Bob Johnson',
    bio: 'Electronic music producer and DJ',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Music',
    payoutAddress: '0x2345678901234567890123456789012345678901',
    suggestedAmounts: [3, 7, 15, 30],
    socials: {
      x: 'bob_music',
      website: 'https://bob-music.com'
    },
    metrics: {
      totalTipsUSD: 890.25,
      supporters: 32
    },
    ownerAddress: '0x2345678901234567890123456789012345678901',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'charlie-dev',
    name: 'Charlie Smith',
    bio: 'Full-stack developer building the future of web3',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Dev',
    payoutAddress: '0x3456789012345678901234567890123456789012',
    suggestedAmounts: [10, 20, 50, 100],
    socials: {
      x: 'charlie_dev',
      farcaster: 'charlie'
    },
    metrics: {
      totalTipsUSD: 2100.75,
      supporters: 67
    },
    ownerAddress: '0x3456789012345678901234567890123456789012',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'diana-gaming',
    name: 'Diana Rodriguez',
    bio: 'Professional gamer and streamer specializing in FPS games',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Gaming',
    payoutAddress: '0x4567890123456789012345678901234567890123',
    suggestedAmounts: [2, 5, 10, 20],
    socials: {
      x: 'diana_gaming',
      website: 'https://diana-gaming.com'
    },
    metrics: {
      totalTipsUSD: 675.80,
      supporters: 28
    },
    ownerAddress: '0x4567890123456789012345678901234567890123',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'eve-art',
    name: 'Eve Thompson',
    bio: 'Abstract painter exploring the intersection of technology and art',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Art',
    payoutAddress: '0x5678901234567890123456789012345678901234',
    suggestedAmounts: [8, 15, 30, 60],
    socials: {
      x: 'eve_art',
      farcaster: 'eve'
    },
    metrics: {
      totalTipsUSD: 1850.30,
      supporters: 52
    },
    ownerAddress: '0x5678901234567890123456789012345678901234',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'frank-music',
    name: 'Frank Wilson',
    bio: 'Jazz musician and composer creating ambient soundscapes',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Music',
    payoutAddress: '0x6789012345678901234567890123456789012345',
    suggestedAmounts: [4, 8, 16, 32],
    socials: {
      x: 'frank_jazz',
      website: 'https://frank-wilson-music.com'
    },
    metrics: {
      totalTipsUSD: 1420.15,
      supporters: 38
    },
    ownerAddress: '0x6789012345678901234567890123456789012345',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'grace-dev',
    name: 'Grace Lee',
    bio: 'Blockchain developer and DeFi protocol architect',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Dev',
    payoutAddress: '0x7890123456789012345678901234567890123456',
    suggestedAmounts: [15, 30, 60, 120],
    socials: {
      x: 'grace_dev',
      farcaster: 'grace'
    },
    metrics: {
      totalTipsUSD: 3200.90,
      supporters: 89
    },
    ownerAddress: '0x7890123456789012345678901234567890123456',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'henry-gaming',
    name: 'Henry Brown',
    bio: 'Indie game developer creating pixel art adventures',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Gaming',
    payoutAddress: '0x8901234567890123456789012345678901234567',
    suggestedAmounts: [6, 12, 24, 48],
    socials: {
      x: 'henry_games',
      website: 'https://henry-brown-games.com'
    },
    metrics: {
      totalTipsUSD: 980.45,
      supporters: 41
    },
    ownerAddress: '0x8901234567890123456789012345678901234567',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'iris-art',
    name: 'Iris Davis',
    bio: 'Digital sculptor and 3D artist pushing creative boundaries',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iris&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Art',
    payoutAddress: '0x9012345678901234567890123456789012345678',
    suggestedAmounts: [12, 25, 50, 100],
    socials: {
      x: 'iris_3d',
      farcaster: 'iris'
    },
    metrics: {
      totalTipsUSD: 2150.75,
      supporters: 73
    },
    ownerAddress: '0x9012345678901234567890123456789012345678',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'jack-music',
    name: 'Jack Miller',
    bio: 'Electronic music producer and sound designer',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Music',
    payoutAddress: '0x0123456789012345678901234567890123456789',
    suggestedAmounts: [5, 10, 20, 40],
    socials: {
      x: 'jack_electro',
      website: 'https://jack-miller-music.com'
    },
    metrics: {
      totalTipsUSD: 1680.20,
      supporters: 56
    },
    ownerAddress: '0x0123456789012345678901234567890123456789',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'luna-photography',
    name: 'Luna Martinez',
    bio: 'Professional photographer capturing the beauty of urban landscapes',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Photography',
    payoutAddress: '0x1111111111111111111111111111111111111111',
    suggestedAmounts: [8, 15, 30, 60],
    socials: {
      x: 'luna_photos',
      website: 'https://luna-photography.com',
      farcaster: 'luna'
    },
    metrics: {
      totalTipsUSD: 2340.80,
      supporters: 78
    },
    ownerAddress: '0x1111111111111111111111111111111111111111',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'marcus-podcast',
    name: 'Marcus Thompson',
    bio: 'Tech podcast host discussing the latest in blockchain and AI',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Podcast',
    payoutAddress: '0x2222222222222222222222222222222222222222',
    suggestedAmounts: [3, 7, 15, 30],
    socials: {
      x: 'marcus_tech',
      website: 'https://marcus-podcast.com'
    },
    metrics: {
      totalTipsUSD: 1450.30,
      supporters: 42
    },
    ownerAddress: '0x2222222222222222222222222222222222222222',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'sophia-writing',
    name: 'Sophia Chen',
    bio: 'Technical writer and content creator specializing in Web3 tutorials',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Writing',
    payoutAddress: '0x3333333333333333333333333333333333333333',
    suggestedAmounts: [5, 12, 25, 50],
    socials: {
      x: 'sophia_writes',
      farcaster: 'sophia',
      website: 'https://sophia-writing.com'
    },
    metrics: {
      totalTipsUSD: 1890.45,
      supporters: 65
    },
    ownerAddress: '0x3333333333333333333333333333333333333333',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'alex-fitness',
    name: 'Alex Rodriguez',
    bio: 'Fitness coach and wellness influencer sharing workout routines',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Fitness',
    payoutAddress: '0x4444444444444444444444444444444444444444',
    suggestedAmounts: [4, 8, 16, 32],
    socials: {
      x: 'alex_fitness',
      website: 'https://alex-fitness.com'
    },
    metrics: {
      totalTipsUSD: 1120.75,
      supporters: 34
    },
    ownerAddress: '0x4444444444444444444444444444444444444444',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'zara-fashion',
    name: 'Zara Williams',
    bio: 'Sustainable fashion designer and eco-conscious lifestyle blogger',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zara&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Fashion',
    payoutAddress: '0x5555555555555555555555555555555555555555',
    suggestedAmounts: [6, 12, 24, 48],
    socials: {
      x: 'zara_fashion',
      website: 'https://zara-sustainable.com',
      farcaster: 'zara'
    },
    metrics: {
      totalTipsUSD: 2750.90,
      supporters: 91
    },
    ownerAddress: '0x5555555555555555555555555555555555555555',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'david-cooking',
    name: 'David Kim',
    bio: 'Chef and food blogger sharing authentic Asian cuisine recipes',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Cooking',
    payoutAddress: '0x6666666666666666666666666666666666666666',
    suggestedAmounts: [2, 5, 10, 20],
    socials: {
      x: 'david_chef',
      website: 'https://david-kim-cooking.com'
    },
    metrics: {
      totalTipsUSD: 980.25,
      supporters: 29
    },
    ownerAddress: '0x6666666666666666666666666666666666666666',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'emma-travel',
    name: 'Emma Johnson',
    bio: 'Travel vlogger exploring hidden gems around the world',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Travel',
    payoutAddress: '0x7777777777777777777777777777777777777777',
    suggestedAmounts: [7, 14, 28, 56],
    socials: {
      x: 'emma_travels',
      website: 'https://emma-travel-blog.com',
      farcaster: 'emma'
    },
    metrics: {
      totalTipsUSD: 3200.60,
      supporters: 108
    },
    ownerAddress: '0x7777777777777777777777777777777777777777',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'ryan-education',
    name: 'Ryan O\'Connor',
    bio: 'Math tutor and educational content creator making learning fun',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Education',
    payoutAddress: '0x8888888888888888888888888888888888888888',
    suggestedAmounts: [5, 10, 20, 40],
    socials: {
      x: 'ryan_math',
      website: 'https://ryan-math-tutor.com'
    },
    metrics: {
      totalTipsUSD: 1560.40,
      supporters: 47
    },
    ownerAddress: '0x8888888888888888888888888888888888888888',
    createdAt: new Date().toISOString()
  },
  {
    slug: 'maya-wellness',
    name: 'Maya Patel',
    bio: 'Yoga instructor and meditation guide promoting mental wellness',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    category: 'Wellness',
    payoutAddress: '0x9999999999999999999999999999999999999999',
    suggestedAmounts: [8, 16, 32, 64],
    socials: {
      x: 'maya_yoga',
      website: 'https://maya-wellness.com',
      farcaster: 'maya'
    },
    metrics: {
      totalTipsUSD: 2180.15,
      supporters: 72
    },
    ownerAddress: '0x9999999999999999999999999999999999999999',
    createdAt: new Date().toISOString()
  }
];

export const creatorsStore = {
  getAll(): Creator[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Seed with mock data on first run
        this.setAll(MOCK_CREATORS);
        return MOCK_CREATORS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading creators from localStorage:', error);
      return MOCK_CREATORS;
    }
  },

  setAll(creators: Creator[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(creators));
    } catch (error) {
      console.error('Error saving creators to localStorage:', error);
    }
  },

  getBySlug(slug: string): Creator | null {
    const creators = this.getAll();
    return creators.find(creator => creator.slug === slug) || null;
  },

  add(creator: Creator): void {
    const creators = this.getAll();
    creators.push(creator);
    this.setAll(creators);
  },

  update(slug: string, updates: Partial<Creator>): void {
    const creators = this.getAll();
    const index = creators.findIndex(creator => creator.slug === slug);
    if (index !== -1) {
      creators[index] = { ...creators[index], ...updates, updatedAt: new Date().toISOString() };
      this.setAll(creators);
    }
  },

  remove(slug: string): void {
    const creators = this.getAll();
    const filtered = creators.filter(creator => creator.slug !== slug);
    this.setAll(filtered);
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  initialize(): void {
    // Force initialize with mock data if empty
    const existing = this.getAll();
    if (existing.length === 0) {
      console.log('Initializing creators store with mock data...');
      this.setAll(MOCK_CREATORS);
    }
  },

  // Force initialize - always sets mock data
  forceInitialize(): void {
    console.log('Force initializing creators store with mock data...');
    this.setAll(MOCK_CREATORS);
  }
};
