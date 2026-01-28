"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Brand } from "@/types/product";
import { getCategories, getBrands } from "@/services/productService";

interface FilterSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ isOpen = false, onClose }: FilterSidebarProps) {
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

    // Obtener audiencia actual de la URL
    const currentAudience = searchParams.get("audience");

    // Cargar categorías y marcas filtradas por audiencia
    useEffect(() => {
        async function loadFilters() {
            setLoading(true);
            try {
                const [cats, brds] = await Promise.all([
                    getCategories(currentAudience || undefined),
                    getBrands(currentAudience || undefined),
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
    }, [currentAudience]);

    // Resetear filtros de categoría y marca cuando cambie la audiencia
    useEffect(() => {
        // Verificar si la categoría/marca seleccionada sigue existiendo en las nuevas opciones
        if (selectedCategory && categories.length > 0) {
            const categoryExists = categories.some(c => c.slug === selectedCategory);
            if (!categoryExists) {
                setSelectedCategory(null);
                // Actualizar URL silenciosamente
                const current = new URLSearchParams(searchParams.toString());
                current.delete('category');
                router.replace(`/catalogo?${current.toString()}`);
            }
        }
        if (selectedBrand && brands.length > 0) {
            const brandExists = brands.some(b => b.slug === selectedBrand);
            if (!brandExists) {
                setSelectedBrand(null);
                const current = new URLSearchParams(searchParams.toString());
                current.delete('brand');
                router.replace(`/catalogo?${current.toString()}`);
            }
        }
    }, [categories, brands, selectedCategory, selectedBrand, searchParams, router]);

    // Prevent body scroll when drawer is open (mobile)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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

    const handleApplyAndClose = () => {
        onClose?.();
    };

    // Verificar si hay filtros activos
    const hasActiveFilters =
        selectedCategory || selectedBrand || minPrice || maxPrice || searchQuery;

    // Contenido del sidebar (reutilizado en ambos modos)
    const sidebarContent = (
        <div className="space-y-6">
            {/* Búsqueda */}
            <form onSubmit={handleSearchChange} className="relative">
                <input
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary pl-10 shadow-sm p-3 border min-h-[44px]"
                    placeholder="Buscar productos..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute left-3 top-3.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </form>

            {/* Botón Limpiar Filtros */}
            {hasActiveFilters && (
                <button
                    onClick={handleClearAllFilters}
                    className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Limpiar filtros
                </button>
            )}

            {/* CATEGORÍAS */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                    CATEGORÍAS
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
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
                            <label className="flex items-center cursor-pointer group py-2 min-h-[44px]">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === null}
                                    onChange={() => handleCategoryChange(null)}
                                    className="form-radio h-5 w-5 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                />
                                <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors font-medium">
                                    📦 Todo el catálogo
                                </span>
                            </label>

                            {/* Categorías dinámicas */}
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center cursor-pointer group py-2 min-h-[44px]"
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === category.slug}
                                        onChange={() => handleCategoryChange(category.slug)}
                                        className="form-radio h-5 w-5 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                    />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors">
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
                        <span className="absolute left-3 top-3 text-gray-500 text-sm">$</span>
                        <input
                            className="w-full pl-7 py-2.5 text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border min-h-[44px]"
                            placeholder="Min"
                            type="number"
                            min="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative w-full">
                        <span className="absolute left-3 top-3 text-gray-500 text-sm">$</span>
                        <input
                            className="w-full pl-7 py-2.5 text-sm rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary border min-h-[44px]"
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
                    className="w-full py-2.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors min-h-[44px]"
                >
                    Aplicar precio
                </button>
            </div>

            {/* MARCAS */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                    MARCAS
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
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
                        <p className="text-sm text-gray-400 italic py-2">
                            No hay marcas disponibles
                        </p>
                    ) : (
                        <>
                            {/* Todas las marcas */}
                            <label className="flex items-center cursor-pointer group py-2 min-h-[44px]">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={selectedBrand === null}
                                    onChange={() => handleBrandChange(null)}
                                    className="form-radio h-5 w-5 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                />
                                <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors font-medium">
                                    🏷️ Todas las marcas
                                </span>
                            </label>

                            {/* Marcas dinámicas */}
                            {brands.map((brand) => (
                                <label
                                    key={brand.id}
                                    className="flex items-center cursor-pointer group py-2 min-h-[44px]"
                                >
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedBrand === brand.slug}
                                        onChange={() => handleBrandChange(brand.slug)}
                                        className="form-radio h-5 w-5 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary"
                                    />
                                    <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm group-hover:text-primary transition-colors">
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
    );

    return (
        <>
            {/* DESKTOP SIDEBAR - Hidden on mobile */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                    {sidebarContent}
                </div>
            </aside>

            {/* MOBILE DRAWER - Off-canvas fullscreen */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'
                    }`}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={onClose}
                />

                {/* Drawer panel */}
                <div
                    className={`absolute inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            Filtrar y Ordenar
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content - scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {sidebarContent}
                    </div>

                    {/* Footer - sticky button */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
                        <button
                            onClick={handleApplyAndClose}
                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-base font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg min-h-[48px]"
                        >
                            Ver resultados
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
