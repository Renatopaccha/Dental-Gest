'use client';

import Link from "next/link";
import Image from "next/image";
import { ProductDisplay } from "@/types/product";

// Imagen placeholder cuando no hay imagen del producto
const PLACEHOLDER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png";

interface ProductCardProps {
    product: ProductDisplay;
}

/**
 * Tarjeta de producto con soporte para:
 * - Precios con descuento (precio tachado + precio de oferta)
 * - Etiqueta de porcentaje de descuento
 * - Estados de stock dinámicos
 * - Imágenes desde Django o placeholder
 */
export function ProductCard({ product }: ProductCardProps) {
    const {
        id,
        name,
        price,
        discountPrice,
        currentPrice,
        hasDiscount,
        discountPercentage,
        categoryName,
        stockCount,
        inStock,
        stockStatus,
        imageUrl,
    } = product;

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

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700">
            {/* Imagen del producto */}
            <Link href={`/producto/${id}`} className="block relative h-48 overflow-hidden">
                <Image
                    src={imageUrl || PLACEHOLDER_IMAGE}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

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

                {/* Botón de acción */}
                <div className="mt-4">
                    {inStock ? (
                        <Link
                            href={`/producto/${id}`}
                            className="block w-full text-center py-2 px-4 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Ver Producto
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="block w-full text-center py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-medium rounded-lg cursor-not-allowed"
                        >
                            Agotado
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
