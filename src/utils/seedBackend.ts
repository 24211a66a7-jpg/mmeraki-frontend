// Utility to seed the backend with mock data
import { seedBackend } from '@/data/events';

export const initializeBackend = async (): Promise<boolean> => {
  try {
    const success = await seedBackend();
    
    if (success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// Auto-seed on development (silenced)
if (import.meta.env.DEV) {
  // Check if we're in the browser and not already seeded
  if (typeof window !== 'undefined' && !window.localStorage.getItem('backend-seeded')) {
    initializeBackend().then((success) => {
      if (success) {
        window.localStorage.setItem('backend-seeded', 'true');
      }
    });
  }
}
