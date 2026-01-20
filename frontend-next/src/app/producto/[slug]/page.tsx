import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { products } from "@/lib/data";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = products.find((p) => p.id === slug);

    if (!product) {
        notFound();
    }

    // Related products (excluding current one)
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
                <nav aria-label="Breadcrumb" className="flex text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link className="hover:text-primary dark:hover:text-primary" href="/">Inicio</Link>
                        </li>
                        <li><span className="text-xs mx-1">/</span></li>
                        <li>
                            <Link className="hover:text-primary dark:hover:text-primary" href="/catalogo">Catálogo</Link>
                        </li>
                        <li><span className="text-xs mx-1">/</span></li>
                        <li aria-current="page">
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Image Section */}
                    <div className="product-gallery flex flex-col gap-4">
                        <div className="w-full aspect-square bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 relative flex items-center justify-center p-8">
                            <img
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                                src={product.image}
                            />
                            {product.stockCount > 0 && product.stockCount < 5 && (
                                <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    Poco Stock
                                </div>
                            )}
                        </div>
                        {/* Thumbnails (Static for now as we have single image per product in data) */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3].map((i) => (
                                <button key={i} className={`aspect-square rounded-lg border ${i === 1 ? 'border-primary' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 overflow-hidden p-1`}>
                                    <img alt="Thumbnail" className="w-full h-full object-contain" src={product.image} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="mt-10 lg:mt-0 flex flex-col">
                        <div className="mb-4">
                            {product.inStock && product.stockCount > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    En Stock y Listo para Enviar
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    Agotado
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-2 font-poppins">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <div className="flex items-center text-yellow-400 text-sm gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <span key={s} className="material-icons-outlined text-sm">star</span>
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">(48 Reseñas)</span>
                            <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
                            <span className="text-sm text-primary font-medium">{product.category}</span>
                        </div>

                        <div className="mb-6">
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-slate-500 mt-1">El precio incluye IVA. Envío gratuito en pedidos superiores a $200.</p>
                        </div>

                        <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 mb-8">
                            <p>{product.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mb-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary mt-0.5">
                                    <span className="material-icons-outlined text-xs">shield</span>
                                </div>
                                <p className="ml-3 text-sm text-slate-600 dark:text-slate-300">Garantía de Calidad</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary mt-0.5">
                                    <span className="material-icons-outlined text-xs">local_shipping</span>
                                </div>
                                <p className="ml-3 text-sm text-slate-600 dark:text-slate-300">Envío Rápido</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                        <div className="mt-8 flex flex-col gap-4">
                            <div className="bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6 border border-blue-100 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">¿Interesado en este producto?</h3>
                                <WhatsAppButton product={product} />
                                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-1">
                                    <span className="material-icons-outlined text-xs">schedule</span> Normalmente responde en 5 minutos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-poppins">También te podría interesar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <div key={p.id} className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-white relative p-4 flex items-center justify-center">
                                    <img alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" src={p.image} />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        <Link href={`/producto/${p.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0"></span>
                                            {p.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.category}</p>
                                    <p className="mt-2 text-base font-medium text-primary">${p.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
