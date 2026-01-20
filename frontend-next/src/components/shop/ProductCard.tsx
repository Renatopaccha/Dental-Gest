import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/data";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = !product.inStock || product.stockCount === 0;
    const isLowStock = product.stockCount > 0 && product.stockCount < 5;

    let statusLabel = "En Stock";
    let statusColor = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";

    if (isOutOfStock) {
        statusLabel = "Agotado";
        statusColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    } else if (isLowStock) {
        statusLabel = "Poco Stock";
        statusColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition group flex flex-col h-full">
            <div className="relative h-56 bg-white p-4 flex items-center justify-center">
                <span className={`absolute top-3 left-3 ${statusColor} text-xs font-bold px-2 py-1 rounded`}>
                    {statusLabel.toUpperCase()}
                </span>
                <Image
                    alt={product.name}
                    className={`object-contain p-4 transition duration-300 ${isOutOfStock ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
                    src={product.image}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-slate-500 mb-1">{product.category}</div>
                <Link href={`/producto/${product.id}`}>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 truncate hover:text-primary transition">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    {isOutOfStock ? (
                        <button disabled className="bg-gray-100 text-gray-400 p-2 rounded-full cursor-not-allowed">
                            <span className="material-icons-outlined text-sm">block</span>
                        </button>
                    ) : (
                        <Link href={`/producto/${product.id}`} className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-full transition">
                            <span className="material-icons-outlined text-sm">add_shopping_cart</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
