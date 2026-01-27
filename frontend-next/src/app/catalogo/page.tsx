import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { CatalogoClient } from "./CatalogoClient";
import Link from "next/link";

// Loading fallback para el grid de productos
function ProductGridSkeleton() {
    return (
        <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
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
        </div>
    );
}

// Loading fallback para el sidebar
function SidebarSkeleton() {
    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default function CatalogoPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar de filtros */}
                        <Suspense fallback={<SidebarSkeleton />}>
                            <FilterSidebar />
                        </Suspense>

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
