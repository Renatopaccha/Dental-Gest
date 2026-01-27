"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts, GetProductsOptions } from "@/services/productService";
import { ProductDisplay } from "@/types/product";

export function CatalogoClient() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ProductDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState<string>(
        searchParams.get("ordering") || "-created_at"
    );

    // Re-fetch productos cuando cambian los parámetros de URL
    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            try {
                const options: GetProductsOptions = {
                    ordering,
                };

                const category = searchParams.get("category");
                const brand = searchParams.get("brand");
                const minPrice = searchParams.get("min_price");
                const maxPrice = searchParams.get("max_price");
                const search = searchParams.get("search");

                if (category) options.category = category;
                if (brand) options.brand = brand;
                if (minPrice) options.minPrice = parseFloat(minPrice);
                if (maxPrice) options.maxPrice = parseFloat(maxPrice);
                if (search) options.search = search;

                const data = await getProducts(options);
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, [searchParams, ordering]);

    // Obtener descripción de filtros activos
    const getActiveFiltersDescription = () => {
        const parts: string[] = [];
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const minPrice = searchParams.get("min_price");
        const maxPrice = searchParams.get("max_price");
        const search = searchParams.get("search");

        if (search) parts.push(`"${search}"`);
        if (category) parts.push(`categoría: ${category}`);
        if (brand) parts.push(`marca: ${brand}`);
        if (minPrice || maxPrice) {
            parts.push(`precio: ${minPrice || "0"} - ${maxPrice || "∞"}`);
        }

        return parts.length > 0 ? `Filtros: ${parts.join(", ")}` : null;
    };

    const filtersDescription = getActiveFiltersDescription();

    return (
        <div className="flex-grow">
            {/* Header de resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    {loading ? (
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                        <p className="text-slate-600 dark:text-slate-400">
                            {products.length === 0 ? (
                                <span>No se encontraron productos</span>
                            ) : (
                                <span>
                                    Mostrando <strong>{products.length}</strong> productos
                                </span>
                            )}
                        </p>
                    )}
                    {filtersDescription && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {filtersDescription}
                        </p>
                    )}
                </div>
                <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="-created_at">Más recientes</option>
                    <option value="price">Precio: menor a mayor</option>
                    <option value="-price">Precio: mayor a menor</option>
                    <option value="name">Nombre: A-Z</option>
                    <option value="-name">Nombre: Z-A</option>
                </select>
            </div>

            {/* Loading skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse"
                        >
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                /* Mensaje cuando no hay productos */
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No se encontraron productos
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Intenta ajustar los filtros o busca algo diferente.
                    </p>
                </div>
            ) : (
                /* Grid de productos */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
