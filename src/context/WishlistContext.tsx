import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

export interface WishlistItem {
  id: string;
  user_id: string;
  experience_id: string;
  created_at: string;
  title: string;
  slug: string;
  base_price: number;
  thumbnail_url: string;
  category: string;
  subcategory?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  count: number;
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (experienceId: string) => Promise<void>;
  removeFromWishlist: (experienceId: string) => Promise<void>;
  isInWishlist: (experienceId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<WishlistState>({
    items: [],
    isLoading: false,
    count: 0
  });

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setState({
        items: [],
        isLoading: false,
        count: 0
      });
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await api.get<any>('/wishlist');
      if (data) {
        setState({
          items: data.wishlist || [],
          isLoading: false,
          count: data.wishlist?.length || 0
        });
      } else {
        throw new Error('Failed to fetch wishlist');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const addToWishlist = async (experienceId: string) => {
    if (!user) return;

    try {
      const data = await api.post<any>('/wishlist', { experience_id: experienceId });
      if (data && data.item) {
        setState(prev => ({
          ...prev,
          items: [...prev.items, data.item],
          count: prev.count + 1
        }));
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        });
      } else {
        throw new Error(data?.message || 'Failed to add to wishlist');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeFromWishlist = async (experienceId: string) => {
    if (!user) return;

    try {
      const res = await api.delete<any>(`/wishlist/${experienceId}`);
      if (res || res === undefined) {
        setState(prev => ({
          ...prev,
          items: prev.items.filter(item => item.experience_id !== experienceId),
          count: Math.max(0, prev.count - 1)
        }));
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist.",
        });
      } else {
        throw new Error('Failed to remove from wishlist');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from wishlist.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const isInWishlist = (experienceId: string): boolean => {
    return state.items.some(item => item.experience_id === experienceId);
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{
      ...state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
