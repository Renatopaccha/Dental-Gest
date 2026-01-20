import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { getProductById, getProducts } from "@/services/productService";

// Imagen placeholder
const PLACEHOLDER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductoPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const productId = parseInt(slug, 10);

    // Obtener producto desde la API
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    // Obtener productos relacionados (excluyendo el actual)
    const allProducts = await getProducts();
    const relatedProducts = allProducts
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    // Determinar estilos de stock
    const getStockStyle = () => {
        if (product.stockCount === 0) {
            return { bg: "bg-red-100", text: "text-red-600" };
        }
        if (product.stockCount < 5) {
            return { bg: "bg-yellow-100", text: "text-yellow-600" };
        }
        return { bg: "bg-green-100", text: "text-green-600" };
    };
    const stockStyle = getStockStyle();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-slate-500 hover:text-primary">Inicio</Link>
                            <span className="text-slate-300">/</span>
                            <Link href="/catalogo" className="text-slate-500 hover:text-primary">Catálogo</Link>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Producto */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Imagen */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg">
                            <Image
                                src={product.imageUrl || PLACEHOLDER_IMAGE}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Badge de descuento */}
                            {product.hasDiscount && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-xl shadow-lg">
                                    -{product.discountPercentage}%
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-6">
                            {/* Categoría */}
                            <span className="text-primary font-semibold uppercase tracking-wide">
                                {product.categoryName}
                            </span>

                            {/* Nombre */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white font-poppins">
                                {product.name}
                            </h1>

                            {/* Precio */}
                            <div className="flex items-baseline gap-4">
                                {product.hasDiscount ? (
                                    <>
                                        <span className="text-4xl font-bold text-primary">
                                            ${product.currentPrice.toFixed(2)}
                                        </span>
                                        <span className="text-2xl text-slate-400 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                            Ahorras ${(product.price - product.currentPrice).toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-slate-800 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${stockStyle.bg} ${stockStyle.text}`}>
                                <span className="material-icons-outlined text-sm">
                                    {product.inStock ? 'check_circle' : 'cancel'}
                                </span>
                                <span className="font-semibold">{product.stockStatus}</span>
                                {product.inStock && (
                                    <span className="text-sm">({product.stockCount} unidades)</span>
                                )}
                            </div>

                            {/* Descripción */}
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {product.description}
                            </p>

                            {/* WhatsApp Button */}
                            <WhatsAppButton
                                productName={product.name}
                                inStock={product.inStock}
                            />

                            {/* Características */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <span className="material-icons-outlined text-primary">verified</span>
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Garantía de Calidad</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                        <span className="material-icons-outlined text-primary">local_shipping</span>
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Envío Rápido</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productos relacionados */}
                {relatedProducts.length > 0 && (
                    <section className="bg-white dark:bg-slate-900 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 font-poppins">
                                También te podría interesar
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}
