// Backend API types (matching the backend Experience interface)
export interface Experience {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  short_desc?: string;
  description?: string;
  base_price?: number;
  images?: string[];
  thumbnail_url?: string;
  template_type?: 'standard' | 'special';
  is_featured?: boolean;
  created_at?: string;
}

// Frontend Event interface (for compatibility with existing components)
export interface Event {
  id: string;
  title: string;
  slug: string; // Add slug field
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  description: string;
  shortDesc?: string;
  basePrice?: number;
  rating: number;
  reviews: number;
  duration: string;
  capacity: string;
  location: string;
  features: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}

// API Configuration
import { api } from '@/lib/api';
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'https://mmeraki-backend1.vercel.app/api';

// Cache for storing fetched data
let experiencesCache: Experience[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Utility function to convert Experience to Event format
const convertExperienceToEvent = (experience: Experience): Event => {
  return {
    id: experience.id,
    title: experience.title,
    slug: experience.slug, // Add slug to the Event interface
    category: experience.category,
    price: experience.base_price ? `₹${experience.base_price.toLocaleString()}` : '₹0',
    originalPrice: experience.base_price && experience.base_price > 1000 ? `₹${(experience.base_price * 1.3).toLocaleString()}` : undefined,
    image: experience.thumbnail_url || experience.images?.[0] || '/src/assets/anniversary-event.jpg',
    images: experience.images || [],
    description: experience.description || experience.short_desc || '',
    shortDesc: experience.short_desc || '',
    basePrice: experience.base_price,
    rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
    reviews: Math.floor(Math.random() * 200) + 20, // Mock reviews between 20-220
    duration: getMockDuration(experience.category),
    capacity: getMockCapacity(experience.category),
    location: 'Delhi NCR',
    features: getMockFeatures(experience.category),
    isPopular: experience.is_featured || false,
    isNew: experience.template_type === 'special' || false
  };
};

// Helper functions for mock data
const getMockDuration = (category: string): string => {
  const durations: Record<string, string> = {
    'anniversary': '3 hours',
    'birthday': '4 hours',
    'corporate': '6 hours',
    'kids': '3 hours',
    'festival': '6 hours',
    'celebration': '4 hours'
  };
  return durations[category.toLowerCase()] || '4 hours';
};

const getMockCapacity = (category: string): string => {
  const capacities: Record<string, string> = {
    'anniversary': '2-4 people',
    'birthday': '10-20 people',
    'corporate': '20-50 people',
    'kids': '8-15 kids',
    'festival': '20-50 people',
    'celebration': '15-30 people'
  };
  return capacities[category.toLowerCase()] || '10-20 people';
};

const getMockFeatures = (category: string): string[] => {
  const features: Record<string, string[]> = {
    'anniversary': ['Romantic setup', 'Premium decorations', 'Photography', 'Personalized touches'],
    'birthday': ['Party decorations', 'Cake setup', 'Entertainment', 'Surprise elements'],
    'corporate': ['Professional setup', 'Catering', 'Networking activities', 'Executive service'],
    'kids': ['Themed decorations', 'Party games', 'Entertainment', 'Kids-friendly setup'],
    'festival': ['Traditional decorations', 'Cultural elements', 'Lighting setup', 'Celebration touches'],
    'celebration': ['Special decorations', 'Entertainment', 'Memory moments', 'Gift presentation']
  };
  return features[category.toLowerCase()] || ['Professional setup', 'Quality service', 'Memorable experience'];
};

// API Functions
const fetchExperiences = async (): Promise<Experience[]> => {
  try {
    const result: ApiResponse<Experience[]> = await api.get(`/experiences`);
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch experiences');
    }
    return result.data;
  } catch (error) {
    // Swallow errors to avoid noisy console logs in production
    throw error;
  }
};

const fetchExperiencesWithCache = async (): Promise<Experience[]> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (experiencesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return experiencesCache;
  }
  
  // Fetch fresh data
  try {
    const experiences = await fetchExperiences();
    experiencesCache = experiences;
    lastFetchTime = now;
    return experiences;
  } catch (error) {
    // If fetch fails and we have cached data, return it
    if (experiencesCache) {
      // Using cached data due to fetch error
      return experiencesCache;
    }
    throw error;
  }
};

// Public API functions
export const getExperiences = async (): Promise<Event[]> => {
  try {
    const experiences = await fetchExperiencesWithCache();
    return experiences.map(convertExperienceToEvent);
  } catch (error) {
    // noop
    // Return empty array as fallback
    return [];
  }
};

export const getExperiencesByCategory = async (category: string): Promise<Event[]> => {
  try {
    const experiences = await fetchExperiencesWithCache();
    const normalize = (s: string) => s.trim().toLowerCase();
    const requested = normalize(category);
    const synonyms: Record<string, string[]> = {
      birthdays: ['birthdays', 'birthday'],
      festivals: ['festivals', 'festival'],
      anniversary: ['anniversary', 'anniversaries'],
      candlelight: ['candlelight', 'candlelight dinners', 'candlelight-dinners'],
      decorations: ['decorations', 'decoration'],
      kids: ['kids', 'kid', 'children'],
      corporate: ['corporate', 'corporate events', 'corporate-event', 'corporate-events'],
      gifts: ['gifts', 'gift']
    };
    const accepted = synonyms[requested] || [requested];
    const filteredExperiences = experiences.filter((exp) => accepted.includes(normalize(exp.category)));
    return filteredExperiences.map(convertExperienceToEvent);
  } catch (error) {
    // noop
    return [];
  }
};

export const getExperiencesBySubcategory = async (subcategory: string): Promise<Event[]> => {
  try {
    const result: ApiResponse<Experience[]> = await api.get(`/experiences`, { subcategory: encodeURIComponent(subcategory) });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch experiences by subcategory');
    }
    return result.data.map(convertExperienceToEvent);
  } catch (error) {
    return [];
  }
};

export const getExperiencesBySubcategories = async (subcategories: string[]): Promise<Event[]> => {
  try {
    const allEvents: Event[] = [];
    
    // Add delay between requests to avoid rate limiting
    for (let i = 0; i < subcategories.length; i++) {
      const subcategory = subcategories[i];
      try {
        const events = await getExperiencesBySubcategory(subcategory);
        allEvents.push(...events);
        
        // Add small delay between requests to avoid rate limiting
        if (i < subcategories.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        // Continue with other subcategories even if one fails
        continue;
      }
    }
    
    // Remove duplicates based on event ID
    const uniqueEvents = allEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    return uniqueEvents;
  } catch (error) {
    return [];
  }
};

export const getExperiencesByCategoryAndSubcategory = async (category: string, subcategory?: string): Promise<Event[]> => {
  try {
    // If subcategory is provided, filter by subcategory (which is more specific)
    if (subcategory) {
      return await getExperiencesBySubcategory(subcategory);
    }
    // Otherwise, filter by category
    return await getExperiencesByCategory(category);
  } catch (error) {
    // noop
    return [];
  }
};

export const getFeaturedExperiences = async (): Promise<Event[]> => {
  try {
    const result: ApiResponse<Experience[]> = await api.get(`/experiences/featured`);
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch featured experiences');
    }
    return result.data.map(convertExperienceToEvent);
  } catch (error) {
    // noop
    return [];
  }
};

export const getExperienceBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const result: ApiResponse<Experience> = await api.get(`/experiences/${slug}`);
    if (!result.success) {
      return null;
    }
    return convertExperienceToEvent(result.data);
  } catch (error) {
    // noop
    // Fallback: try to find by slug in cached data
    try {
      const experiences = await fetchExperiencesWithCache();
      const experience = experiences.find(exp => exp.slug === slug);
      return experience ? convertExperienceToEvent(experience) : null;
    } catch (fallbackError) {
      // noop
      return null;
    }
  }
};

export const searchExperiences = async (query: string): Promise<Event[]> => {
  try {
    const result: ApiResponse<Experience[]> = await api.get(`/experiences/search`, { q: encodeURIComponent(query) });
    if (!result.success) {
      throw new Error(result.error || 'Failed to search experiences');
    }
    return result.data.map(convertExperienceToEvent);
  } catch (error) {
    // noop
    return [];
  }
};

// Legacy functions for backward compatibility
export const getEventsByCategory = getExperiencesByCategory;
export const getFeaturedEvents = getFeaturedExperiences;
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const experiences = await fetchExperiencesWithCache();
    const experience = experiences.find(exp => exp.id === id);
    return experience ? convertExperienceToEvent(experience) : null;
  } catch (error) {
    // noop
    return null;
  }
};

// Categories (static for now, could be fetched from backend in future)
export const categories = [
  { name: 'Anniversary', slug: 'anniversary' },
  { name: 'Birthdays', slug: 'birthdays' },
  { name: 'Gifts', slug: 'gifts' },
  { name: 'Candlelight Dinners', slug: 'candlelight' },
  { name: 'Decorations', slug: 'decorations' },
  { name: 'Festivals', slug: 'festivals' },
  { name: 'Kids Celebrations', slug: 'kids' },
  { name: 'Corporate Events', slug: 'corporate' }
];

// Seed the backend with data (useful for development)
export const seedBackend = async (): Promise<boolean> => {
  try {
    const result: ApiResponse<{ count: number }> = await api.post(`/seed`);
    if (result.success) {
      // Successfully seeded
      // Clear cache to force fresh fetch
      experiencesCache = null;
      lastFetchTime = 0;
      return true;
    }
    return false;
  } catch (error) {
    // noop
    return false;
  }
};
