'use client'

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductVariant, CartItem } from '@/lib/entities/types';

const useCart = (cartKey: string = 'cart') => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const localCart = window.localStorage.getItem(cartKey);
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    } catch (error) {
      console.error(`Error reading ${cartKey} from localStorage`, error);
    }
  }, [cartKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error(`Error writing ${cartKey} to localStorage`, error);
    }
  }, [cart, cartKey]);

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity = 1, note = '') => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id && item.variant.id === variant.id
      );
      
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        if (note && note.trim()) {
          updatedCart[existingItemIndex].note = note;
        }
        return updatedCart;
      } else {
        return [...prevCart, { 
          id: `${product.id}_${variant.id}_${Date.now()}`,
          product, 
          variant, 
          quantity, 
          note: note || ''
        }];
      }
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity < 1) {
        return prevCart.filter(item => item.id !== itemId);
      }
      return prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const updateNote = useCallback((itemId: string, note: string) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item.id === itemId ? { ...item, note } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = item.variant.estimated_price_npr || 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return { 
    cart, 
    addToCart, 
    updateQuantity, 
    updateNote,
    removeFromCart, 
    clearCart, 
    getCartTotal,
    getCartItemCount
  };
};

export default useCart;