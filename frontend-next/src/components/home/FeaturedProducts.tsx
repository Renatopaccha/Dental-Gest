import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/services/productService";
import Link from "next/link";

/**
 * Sección de productos destacados en la página principal.
 * Obtiene los primeros 4 productos desde la API de Django.
 */
export async function FeaturedProducts() {
    // Obtener productos desde la API
    const allProducts = await getProducts();
    const featuredProducts = allProducts.slice(0, 4);

    // Si no hay productos, no renderizar la sección
    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white font-poppins">
                            Suministros Destacados
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Los productos más populares de nuestro catálogo
                        </p>
                    </div>
                    <Link
                        href="/catalogo"
                        className="hidden sm:flex items-center gap-2 text-primary hover:text-blue-700 font-medium transition-colors"
                    >
                        Ver todos
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Link móvil */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
                    >
                        Ver todo el catálogo
                        <span className="material-icons-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
