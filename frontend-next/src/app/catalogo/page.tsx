import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/services/productService";
import Link from "next/link";

export default async function CatalogoPage() {
    // Obtener productos desde la API de Django
    const products = await getProducts();

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
                        <aside className="lg:w-64 flex-shrink-0">
                            <FilterSidebar />
                        </aside>

                        {/* Grid de productos */}
                        <div className="flex-grow">
                            {/* Header de resultados */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-slate-600 dark:text-slate-400">
                                    {products.length === 0 ? (
                                        <span>No se encontraron productos</span>
                                    ) : (
                                        <span>
                                            Mostrando <strong>{products.length}</strong> productos
                                        </span>
                                    )}
                                </p>
                                <select className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="-created_at">Más recientes</option>
                                    <option value="price">Precio: menor a mayor</option>
                                    <option value="-price">Precio: mayor a menor</option>
                                    <option value="name">Nombre: A-Z</option>
                                </select>
                            </div>

                            {/* Mensaje cuando no hay productos */}
                            {products.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No hay productos disponibles
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                                        Agrega productos desde el panel de administración.
                                    </p>
                                    <a
                                        href="http://localhost:8000/admin/products/product/add/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Ir al Admin
                                    </a>
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
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
