"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ProductDisplay } from "@/types/product";

interface AddToCartButtonProps {
    product: ProductDisplay;
    disabled?: boolean;
}

/**
 * Botón de "Añadir al Carrito" para la página de detalle del producto
 */
export function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        if (disabled) return;

        setIsAdding(true);
        addToCart(product);

        setTimeout(() => setIsAdding(false), 800);
    };

    if (disabled) {
        return (
            <button
                disabled
                className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
                <span className="material-icons-outlined">block</span>
                <span>Agotado</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 ${isAdding
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/30"
                    : "bg-primary hover:bg-blue-700 text-white shadow-blue-500/30"
                }`}
        >
            <span className={`material-icons-outlined text-2xl ${isAdding ? 'animate-bounce' : ''}`}>
                {isAdding ? 'check' : 'add_shopping_cart'}
            </span>
            <span>{isAdding ? '¡Añadido al Carrito!' : 'Añadir al Carrito'}</span>
        </button>
    );
}
