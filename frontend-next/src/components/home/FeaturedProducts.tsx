import Link from "next/link";
import { Product } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";

interface FeaturedProductsProps {
    products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
    // Take only the first 4 products for the featured section
    const featured = products.slice(0, 4);

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-poppins">Suministros Destacados</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Equipos mejor calificados actualmente en alta demanda.</p>
                    </div>
                    <Link href="/catalogo" className="text-primary font-semibold hover:text-blue-700 dark:hover:text-blue-400 flex items-center mt-4 md:mt-0">
                        Ver Todos los Productos <span className="material-icons-outlined ml-1">arrow_right_alt</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featured.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
