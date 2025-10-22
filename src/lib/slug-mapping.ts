// Slug to address mapping for creators
// This allows /creator/alice-chen to find the creator's address

interface CreatorMapping {
  slug: string;
  address: string;
  name: string;
}

const STORAGE_KEY = 'basetip.creator-mappings';

class SlugMapping {
  private mappings: Map<string, CreatorMapping> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: CreatorMapping[] = JSON.parse(stored);
        data.forEach(mapping => {
          this.mappings.set(mapping.slug, mapping);
        });
      }
    } catch (error) {
      console.error('Error loading slug mappings from localStorage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.mappings.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving slug mappings to localStorage:', error);
    }
  }

  // Add a new mapping
  addMapping(slug: string, address: string, name: string) {
    const mapping: CreatorMapping = { slug, address, name };
    this.mappings.set(slug, mapping);
    this.saveToStorage();
  }

  // Get address by slug
  getAddressBySlug(slug: string): string | null {
    return this.mappings.get(slug)?.address || null;
  }

  // Get mapping by slug
  getMappingBySlug(slug: string): CreatorMapping | null {
    return this.mappings.get(slug) || null;
  }

  // Get all mappings
  getAllMappings(): CreatorMapping[] {
    return Array.from(this.mappings.values());
  }

  // Update mapping (useful when creator updates their profile)
  updateMapping(slug: string, address: string, name: string) {
    this.addMapping(slug, address, name);
  }

  // Remove mapping
  removeMapping(slug: string) {
    this.mappings.delete(slug);
    this.saveToStorage();
  }

  // Clear all mappings
  clear() {
    this.mappings.clear();
    localStorage.removeItem(STORAGE_KEY);
  }

  // Check if slug exists
  hasSlug(slug: string): boolean {
    return this.mappings.has(slug);
  }
}

export const slugMapping = new SlugMapping();

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to validate slug format
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0;
}
