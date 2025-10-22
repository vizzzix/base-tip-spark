import Dexie, { Table } from 'dexie';
import { OnChainCreatorData } from '@/hooks/useOnChainCreators';

// Database schema
export interface CachedCreator {
  id?: number;
  address: string;
  name: string;
  bio: string;
  avatar: string;
  isActive: boolean;
  totalTipsReceived: number;
  supporterCount: number;
  totalTipsUSD: number;
  supporters: number;
  slug: string;
  category: string;
  suggestedAmounts: number[];
  payoutAddress: string;
  ownerAddress: string;
  createdAt: string;
  updatedAt: string;
  lastSynced: number; // timestamp
  ttl: number; // time-to-live in ms
}

export interface CachedSlugMapping {
  id?: number;
  slug: string;
  address: string;
  name: string;
  lastSynced: number;
  ttl: number;
}

export interface CachedGlobalStats {
  id?: number;
  totalCreators: number;
  totalTips: number;
  totalSupporters: number;
  lastSynced: number;
  ttl: number;
}

class BaseTipDB extends Dexie {
  creators!: Table<CachedCreator>;
  slugMappings!: Table<CachedSlugMapping>;
  globalStats!: Table<CachedGlobalStats>;

  constructor() {
    super('BaseTipDB');
    
    this.version(1).stores({
      creators: '++id, address, slug, lastSynced',
      slugMappings: '++id, slug, address, lastSynced',
      globalStats: '++id, lastSynced'
    });

    // Add indexes for better performance
    this.version(2).stores({
      creators: '++id, address, slug, lastSynced, isActive',
      slugMappings: '++id, slug, address, lastSynced',
      globalStats: '++id, lastSynced'
    });
  }
}

export const db = new BaseTipDB();

// TTL constants
const TTL_24_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const TTL_1_HOUR = 60 * 60 * 1000; // 1 hour for slug mappings

// Helper functions
export function isStale(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp > ttl;
}

// Creator cache functions
export async function cacheCreator(creator: OnChainCreatorData): Promise<void> {
  const cachedCreator: CachedCreator = {
    address: creator.wallet,
    name: creator.name,
    bio: creator.bio,
    avatar: creator.avatar,
    isActive: creator.isActive,
    totalTipsReceived: Number(creator.totalTipsReceived),
    supporterCount: Number(creator.supporterCount),
    totalTipsUSD: creator.totalTipsUSD,
    supporters: creator.supporters,
    slug: creator.slug,
    category: creator.category,
    suggestedAmounts: creator.suggestedAmounts,
    payoutAddress: creator.payoutAddress,
    ownerAddress: creator.ownerAddress,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt || new Date().toISOString(),
    lastSynced: Date.now(),
    ttl: TTL_24_HOURS
  };

  await db.creators.put(cachedCreator);
}

export async function cacheCreators(creators: OnChainCreatorData[]): Promise<void> {
  const cachedCreators: CachedCreator[] = creators.map(creator => ({
    address: creator.wallet,
    name: creator.name,
    bio: creator.bio,
    avatar: creator.avatar,
    isActive: creator.isActive,
    totalTipsReceived: Number(creator.totalTipsReceived),
    supporterCount: Number(creator.supporterCount),
    totalTipsUSD: creator.totalTipsUSD,
    supporters: creator.supporters,
    slug: creator.slug,
    category: creator.category,
    suggestedAmounts: creator.suggestedAmounts,
    payoutAddress: creator.payoutAddress,
    ownerAddress: creator.ownerAddress,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt || new Date().toISOString(),
    lastSynced: Date.now(),
    ttl: TTL_24_HOURS
  }));

  await db.creators.bulkPut(cachedCreators);
}

export async function getCachedCreators(): Promise<OnChainCreatorData[]> {
  const cached = await db.creators
    .where('lastSynced')
    .above(Date.now() - TTL_24_HOURS)
    .toArray();

  return cached.map(creator => ({
    wallet: creator.address,
    name: creator.name,
    bio: creator.bio,
    avatar: creator.avatar,
    isActive: creator.isActive,
    totalTipsReceived: BigInt(creator.totalTipsReceived),
    supporterCount: BigInt(creator.supporterCount),
    totalTipsUSD: creator.totalTipsUSD,
    supporters: creator.supporters,
    slug: creator.slug,
    category: creator.category,
    suggestedAmounts: creator.suggestedAmounts,
    payoutAddress: creator.payoutAddress,
    ownerAddress: creator.ownerAddress,
    createdAt: creator.createdAt,
    updatedAt: creator.updatedAt
  }));
}

export async function getCachedCreatorBySlug(slug: string): Promise<OnChainCreatorData | null> {
  const cached = await db.creators
    .where('slug')
    .equals(slug)
    .and(creator => !isStale(creator.lastSynced, creator.ttl))
    .first();

  if (!cached) return null;

  return {
    wallet: cached.address,
    name: cached.name,
    bio: cached.bio,
    avatar: cached.avatar,
    isActive: cached.isActive,
    totalTipsReceived: BigInt(cached.totalTipsReceived),
    supporterCount: BigInt(cached.supporterCount),
    totalTipsUSD: cached.totalTipsUSD,
    supporters: cached.supporters,
    slug: cached.slug,
    category: cached.category,
    suggestedAmounts: cached.suggestedAmounts,
    payoutAddress: cached.payoutAddress,
    ownerAddress: cached.ownerAddress,
    createdAt: cached.createdAt,
    updatedAt: cached.updatedAt
  };
}

// Slug mapping cache functions
export async function cacheSlugMapping(slug: string, address: string, name: string): Promise<void> {
  const mapping: CachedSlugMapping = {
    slug,
    address,
    name,
    lastSynced: Date.now(),
    ttl: TTL_1_HOUR
  };

  await db.slugMappings.put(mapping);
}

export async function getCachedSlugMapping(slug: string): Promise<{ address: string; name: string } | null> {
  const mapping = await db.slugMappings
    .where('slug')
    .equals(slug)
    .and(m => !isStale(m.lastSynced, m.ttl))
    .first();

  return mapping ? { address: mapping.address, name: mapping.name } : null;
}

export async function getAllCachedSlugMappings(): Promise<Map<string, { address: string; name: string }>> {
  const mappings = await db.slugMappings
    .where('lastSynced')
    .above(Date.now() - TTL_1_HOUR)
    .toArray();

  const map = new Map<string, { address: string; name: string }>();
  mappings.forEach(mapping => {
    map.set(mapping.slug, { address: mapping.address, name: mapping.name });
  });

  return map;
}

// Global stats cache functions
export async function cacheGlobalStats(stats: { totalCreators: number; totalTips: number; totalSupporters: number }): Promise<void> {
  const cached: CachedGlobalStats = {
    totalCreators: stats.totalCreators,
    totalTips: stats.totalTips,
    totalSupporters: stats.totalSupporters,
    lastSynced: Date.now(),
    ttl: TTL_24_HOURS
  };

  await db.globalStats.put(cached);
}

export async function getCachedGlobalStats(): Promise<{ totalCreators: number; totalTips: number; totalSupporters: number } | null> {
  const cached = await db.globalStats
    .where('lastSynced')
    .above(Date.now() - TTL_24_HOURS)
    .first();

  return cached ? {
    totalCreators: cached.totalCreators,
    totalTips: cached.totalTips,
    totalSupporters: cached.totalSupporters
  } : null;
}

// Cleanup functions
export async function cleanupStaleData(): Promise<void> {
  const now = Date.now();
  
  // Remove stale creators
  await db.creators
    .where('lastSynced')
    .below(now - TTL_24_HOURS)
    .delete();

  // Remove stale slug mappings
  await db.slugMappings
    .where('lastSynced')
    .below(now - TTL_1_HOUR)
    .delete();

  // Remove stale global stats
  await db.globalStats
    .where('lastSynced')
    .below(now - TTL_24_HOURS)
    .delete();
}

// Initialize database and cleanup on app start
export async function initializeDB(): Promise<void> {
  try {
    await db.open();
    await cleanupStaleData();
    console.log('BaseTipDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize BaseTipDB:', error);
  }
}
