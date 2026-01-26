"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ProductDisplay } from "@/types/product";

/**
 * Item del carrito con cantidad
 */
export interface CartItem {
    product: ProductDisplay;
    quantity: number;
}

/**
 * Tipo del contexto del carrito
 */
interface CartContextType {
    items: CartItem[];
    addToCart: (product: ProductDisplay, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotal: () => number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "dental-gest-cart";

/**
 * Provider del carrito de compras
 */
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error loading cart from localStorage:", e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Guardar carrito en localStorage cuando cambia
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    // Añadir producto al carrito
    const addToCart = useCallback((product: ProductDisplay, quantity: number = 1) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.product.id === product.id);

            if (existingItem) {
                // Incrementar cantidad si ya existe
                return currentItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Añadir nuevo item
                return [...currentItems, { product, quantity }];
            }
        });
    }, []);

    // Eliminar producto del carrito
    const removeFromCart = useCallback((productId: number) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.product.id !== productId)
        );
    }, []);

    // Actualizar cantidad de un producto
    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    // Limpiar carrito
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Obtener cantidad total de items
    const getItemCount = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    // Obtener total del pedido
    const getTotal = useCallback(() => {
        return items.reduce(
            (total, item) => total + item.product.currentPrice * item.quantity,
            0
        );
    }, [items]);

    // Control del drawer
    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getItemCount,
                getTotal,
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Hook para usar el carrito
 */
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
