'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ProductDisplay, getDisplayImage } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: ProductDisplay;
}

/**
 * Tarjeta de producto con soporte para:
 * - Precios con descuento (precio tachado + precio de oferta)
 * - Etiqueta de porcentaje de descuento
 * - Estados de stock dinámicos
 * - Lógica de fallback para imágenes (principal → galería → placeholder)
 * - Botón de añadir al carrito
 */
export function ProductCard({ product }: ProductCardProps) {
    const {
        id,
        name,
        price,
        currentPrice,
        hasDiscount,
        discountPercentage,
        categoryName,
        stockCount,
        inStock,
        stockStatus,
    } = product;

    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Obtener imagen a mostrar (con fallback automático)
    const displayImage = getDisplayImage(product);

    // Determinar color y texto del estado de stock
    const getStockStyle = () => {
        if (stockCount === 0) {
            return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" };
        }
        if (stockCount < 5) {
            return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" };
        }
        return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" };
    };

    const stockStyle = getStockStyle();

    // Verificar si es una imagen local (placeholder)
    const isLocalImage = displayImage.startsWith('/');

    // Manejar añadir al carrito con animación
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);
        addToCart(product);

        // Resetear animación después de 600ms
        setTimeout(() => setIsAdding(false), 600);
    };

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700">
            {/* Imagen del producto */}
            <Link href={`/producto/${id}`} className="block relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                {isLocalImage ? (
                    // Placeholder local
                    <div className="w-full h-full flex items-center justify-center">
                        <Image
                            src={displayImage}
                            alt={name}
                            width={80}
                            height={80}
                            className="opacity-30"
                        />
                    </div>
                ) : (
                    // Imagen remota
                    <Image
                        src={displayImage}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                )}

                {/* Badge de descuento */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Badge de estado de stock */}
                <div className={`absolute top-2 right-2 ${stockStyle.bg} ${stockStyle.text} text-xs font-semibold px-2 py-1 rounded-md`}>
                    {stockStatus.toUpperCase()}
                </div>

                {/* Indicador de galería */}
                {product.images && product.images.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <span className="material-icons-outlined text-sm">photo_library</span>
                        +{product.images.length}
                    </div>
                )}
            </Link>

            {/* Información del producto */}
            <div className="p-4">
                {/* Categoría */}
                <span className="text-xs text-primary font-medium uppercase tracking-wide">
                    {categoryName}
                </span>

                {/* Nombre */}
                <Link href={`/producto/${id}`}>
                    <h3 className="font-semibold text-slate-800 dark:text-white mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Precios */}
                <div className="mt-2 flex items-baseline gap-2">
                    {hasDiscount ? (
                        <>
                            {/* Precio actual (con descuento) */}
                            <span className="text-xl font-bold text-primary">
                                ${currentPrice.toFixed(2)}
                            </span>
                            {/* Precio original tachado */}
                            <span className="text-sm text-slate-400 line-through">
                                ${price.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        /* Precio normal sin descuento */
                        <span className="text-xl font-bold text-slate-800 dark:text-white">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="mt-4 flex gap-2">
                    {inStock ? (
                        <>
                            <Link
                                href={`/producto/${id}`}
                                className="flex-1 text-center py-2 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-sm"
                            >
                                Ver más
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-2 px-3 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-1 ${isAdding ? 'scale-95 bg-green-500' : ''
                                    }`}
                            >
                                <span className={`material-icons-outlined text-lg ${isAdding ? 'animate-bounce' : ''}`}>
                                    {isAdding ? 'check' : 'add_shopping_cart'}
                                </span>
                                <span className="hidden sm:inline">{isAdding ? '¡Añadido!' : 'Añadir'}</span>
                            </button>
                        </>
                    ) : (
                        <button
                            disabled
                            className="w-full text-center py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-medium rounded-lg cursor-not-allowed"
                        >
                            Agotado
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

