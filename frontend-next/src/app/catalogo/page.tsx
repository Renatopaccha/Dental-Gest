"use client";

import { Suspense, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogoClient } from "./CatalogoClient";
import Link from "next/link";

// Loading fallback para el grid de productos (mobile-first)
function ProductGridSkeleton() {
    return (
        <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse"
                    >
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CatalogoPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-slate-500 hover:text-primary">
                                Inicio
                            </Link>
                            <span className="text-slate-300 dark:text-slate-600">/</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                Catálogo
                            </span>
                        </nav>
                    </div>
                </div>

                {/* Mobile Filter Button - Only visible on mobile */}
                <div className="lg:hidden sticky top-16 z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                    <div className="px-4 py-3">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-700 dark:text-slate-300 font-medium min-h-[48px] active:scale-[0.98] transition-transform"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                            </svg>
                            Filtrar y Ordenar
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Sidebar de filtros */}
                        <FilterSidebar
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                        />

                        {/* Grid de productos */}
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <CatalogoClient />
                        </Suspense>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
