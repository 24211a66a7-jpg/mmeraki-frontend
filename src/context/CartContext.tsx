import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

export interface CartItem {
  id: string;
  user_id: string;
  experience_id: string;
  quantity: number;
  added_at: string;
  title: string;
  slug: string;
  base_price: number;
  thumbnail_url: string;
  category: string;
  subcategory?: string;
  total_price: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  count: number;
  total: number;
}

interface CartContextType extends CartState {
  addToCart: (
    experienceId: string,
    quantity?: number,
    extras?: { selected_date?: string; selected_time?: string; addons?: string[] }
  ) => Promise<void>;
  updateCartItem: (experienceId: string, quantity: number) => Promise<void>;
  removeFromCart: (experienceId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<CartState>({
    items: [],
    isLoading: false,
    count: 0,
    total: 0
  });

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      setState({
        items: [],
        isLoading: false,
        count: 0,
        total: 0
      });
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await api.get<any>('/cart');
      if (data) {
        setState({
          items: data.cart || [],
          isLoading: false,
          count: data.cart?.length || 0,
          total: data.total || 0
        });
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const addToCart = async (
    experienceId: string,
    quantity: number = 1,
    extras?: { selected_date?: string; selected_time?: string; addons?: string[] }
  ) => {
    if (!user) return;

    try {
      const data = await api.post<any>('/cart', {
        experience_id: experienceId,
        quantity: quantity,
        selected_date: extras?.selected_date,
        selected_time: extras?.selected_time,
        addons: extras?.addons
      });
      if (data && data.item) {
        // Check if item already exists in cart
        const existingItemIndex = state.items.findIndex(item => item.experience_id === experienceId);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          setState(prev => ({
            ...prev,
            items: prev.items.map((item, index) => 
              index === existingItemIndex ? data.item : item
            ),
            total: data.item.total_price + prev.items
              .filter((_, index) => index !== existingItemIndex)
              .reduce((sum, item) => sum + item.total_price, 0)
          }));
        } else {
          // Add new item
          setState(prev => ({
            ...prev,
            items: [...prev.items, data.item],
            count: prev.count + 1,
            total: prev.total + data.item.total_price
          }));
        }
        
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart.",
        });
        // Refresh to use backend totals
        await fetchCart();
      } else {
        throw new Error(data?.message || 'Failed to add to cart');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCartItem = async (experienceId: string, quantity: number) => {
    if (!user) return;

    try {
      const response = await api.put<any>('/cart', { experience_id: experienceId, quantity });
      if (response) {
        if (quantity === 0) {
          // Item was removed
          setState(prev => ({
            ...prev,
            items: prev.items.filter(item => item.experience_id !== experienceId),
            count: Math.max(0, prev.count - 1)
          }));
        } else {
          // Item was updated
          const data = response;
          setState(prev => ({
            ...prev,
            items: prev.items.map(item => 
              item.experience_id === experienceId ? data.item : item
            )
          }));
        }
        
        // Recalculate total
        const newTotal = state.items
          .map(item => item.experience_id === experienceId ? 
            (quantity === 0 ? 0 : quantity * item.base_price) : 
            item.total_price
          )
          .reduce((sum, price) => sum + price, 0);
        
        setState(prev => ({ ...prev, total: newTotal }));
        
        toast({
          title: "Cart updated",
          description: "Your cart has been updated.",
        });
      } else {
        throw new Error('Failed to update cart item');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeFromCart = async (experienceId: string) => {
    if (!user) return;

    try {
      const res = await api.delete<any>(`/cart/${experienceId}`);
      if (res || res === undefined) {
        const removedItem = state.items.find(item => item.experience_id === experienceId);
        setState(prev => ({
          ...prev,
          items: prev.items.filter(item => item.experience_id !== experienceId),
          count: Math.max(0, prev.count - 1),
          total: prev.total - (removedItem?.total_price || 0)
        }));
        
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        });
      } else {
        throw new Error('Failed to remove from cart');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from cart.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const res = await api.delete<any>('/cart');
      if (res || res === undefined) {
        setState({
          items: [],
          isLoading: false,
          count: 0,
          total: 0
        });
        
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared.",
        });
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};