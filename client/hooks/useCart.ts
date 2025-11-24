import { useState } from 'react';
import { Product } from '../services/ProductService';

export interface CartItem extends Product {
    cartQuantity: number;
}

export const useCart = () => {
    // Using HashMap (JavaScript Map) for O(1) lookups - Data Structure
    const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const newCart = new Map(prevCart);
            const existing = newCart.get(product.id);

            if (existing) {
                newCart.set(product.id, { ...existing, cartQuantity: existing.cartQuantity + 1 });
            } else {
                newCart.set(product.id, { ...product, cartQuantity: 1 });
            }

            return newCart;
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => {
            const newCart = new Map(prevCart);
            newCart.delete(productId);
            return newCart;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(prevCart => {
            const newCart = new Map(prevCart);
            const item = newCart.get(productId);
            if (item) {
                newCart.set(productId, { ...item, cartQuantity: quantity });
            }
            return newCart;
        });
    };

    const clearCart = () => {
        setCart(new Map());
    };

    const getCartItems = (): CartItem[] => {
        return Array.from(cart.values());
    };

    const getTotal = (): number => {
        return Array.from(cart.values()).reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
    };

    const getItemCount = (): number => {
        return Array.from(cart.values()).reduce((sum, item) => sum + item.cartQuantity, 0);
    };

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItems,
        getTotal,
        getItemCount
    };
};
