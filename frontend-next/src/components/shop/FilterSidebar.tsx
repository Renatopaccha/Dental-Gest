"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Brand } from "@/types/product";
import { getCategories, getBrands } from "@/services/productService";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estado para datos dinámicos
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado de filtros (sincronizado con URL)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        searchParams.get("category")
    );
    const [selectedBrand, setSelectedBrand] = useState<string | null>(
        searchParams.get("brand")
    );
    const [minPrice, setMinPrice] = useState<string>(
        searchParams.get("min_price") || ""
    );
    const [maxPrice, setMaxPrice] = useState<string>(
        searchParams.get("max_price") || ""
    );
    const [searchQuery, setSearchQuery] = useState<string>(
        searchParams.get("search") || ""
    );

    // Cargar categorías y marcas al montar
    useEffect(() => {
        async function loadFilters() {
            try {
                const [cats, brds] = await Promise.all([
                    getCategories(),
                    getBrands(),
                ]);
                setCategories(cats);
                setBrands(brds);
            } catch (error) {
                console.error("Error loading filters:", error);
            } finally {
                setLoading(false);
            }
        }
        loadFilters();
    }, []);

    // Actualizar URL cuando cambian filtros
    const updateURL = useCallback(
        (params: Record<string, string | null>) => {
            const current = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === "") {
                    current.delete(key);
                } else {
                    current.set(key, value);
                }
            });

            const queryString = current.toString();
            router.push(`/catalogo${queryString ? `?${queryString}` : ""}`);
        },
        [router, searchParams]
    );

    // Handlers
    const handleCategoryChange = (slug: string | null) => {
        setSelectedCategory(slug);
        updateURL({ category: slug });
    };

    const handleBrandChange = (slug: string | null) => {
        setSelectedBrand(slug);
        updateURL({ brand: slug });
    };

    const handlePriceChange = () => {
        updateURL({
            min_price: minPrice || null,
            max_price: maxPrice || null,
        });
    };

    const handleSearchChange = (e: React.FormEvent) => {
        e.preventDefault();
        updateURL({ search: searchQuery || null });
    };

    const handleClearAllFilters = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
        setMinPrice("");
        setMaxPrice("");
        setSearchQuery("");
        router.push("/catalogo");
    };

    // Verificar si hay filtros activos
    const hasActiveFilters =
        selectedCategory || selectedBrand || minPrice || maxPrice || searchQuery;

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
                {/* Búsqueda */}
                <form onSubmit={handleSearchChange} className="relative">
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary pl-10 shadow-sm p-2 border"
                        placeholder="Buscar productos..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                        <span className="material-icons-outlined">search</span>
                    </button>
                </form>

                {/* Botón Limpiar Filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearAllFilters}
                        className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-icons-outlined text-base">close</span>
                        Limpiar filtros
                    </button>
                )}

                {/* CATEGORÍAS */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        CATEGORÍAS
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Todo el catálogo */}
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === null}
                                        onChange={() => handleCategoryChange(null)}
                                        className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors font-medium">
                                        📦 Todo el catálogo
                                    </span>
                                </label>

                                {/* Categorías dinámicas */}
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex items-center cursor-pointer group"
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category.slug}
                                            onChange={() => handleCategoryChange(category.slug)}
                                            className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                        />
                                        <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors">
                                            {category.name}
                                        </span>
                                        <span className="ml-auto text-xs text-gray-400">
                                            ({category.product_count})
                                        </span>
                                    </label>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* RANGO DE PRECIO */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        RANGO DE PRECIO
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                            <input
                                className="w-full pl-6 py-1.5 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border"
                                placeholder="Min"
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                            <input
                                className="w-full pl-6 py-1.5 text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border"
                                placeholder="Max"
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handlePriceChange}
                        className="w-full py-1.5 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                        Aplicar precio
                    </button>
                </div>

                {/* MARCAS */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        MARCAS
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : brands.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">
                                No hay marcas disponibles
                            </p>
                        ) : (
                            <>
                                {/* Todas las marcas */}
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedBrand === null}
                                        onChange={() => handleBrandChange(null)}
                                        className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors font-medium">
                                        🏷️ Todas las marcas
                                    </span>
                                </label>

                                {/* Marcas dinámicas */}
                                {brands.map((brand) => (
                                    <label
                                        key={brand.id}
                                        className="flex items-center cursor-pointer group"
                                    >
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={selectedBrand === brand.slug}
                                            onChange={() => handleBrandChange(brand.slug)}
                                            className="form-radio h-4 w-4 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                        />
                                        <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors">
                                            {brand.name}
                                        </span>
                                        <span className="ml-auto text-xs text-gray-400">
                                            ({brand.product_count})
                                        </span>
                                    </label>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
