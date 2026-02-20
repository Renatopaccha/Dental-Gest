"use client";

import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { getDisplayImage } from "@/types/product";

// Número de teléfono de WhatsApp de Dental GEST_EC
const PHONE_NUMBER = "5930961340473";

/**
 * Drawer lateral del carrito de compras
 */
export function CartDrawer() {
    const {
        items,
        isCartOpen,
        closeCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        getItemCount,
        clearCart,
    } = useCart();

    // Generar mensaje de WhatsApp con los productos del carrito
    const generateWhatsAppMessage = () => {
        if (items.length === 0) return "";

        let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";
        message += "🛒 *Mi Pedido:*\n";

        items.forEach((item: CartItem) => {
            const itemTotal = item.product.currentPrice * item.quantity;
            message += `• ${item.quantity}x ${item.product.name} - $${itemTotal.toFixed(2)}\n`;
        });

        message += `\n💰 *Total: $${getTotal().toFixed(2)}*\n\n`;
        message += "¡Gracias!";

        return message;
    };

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(generateWhatsAppMessage())}`;

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay oscuro */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">shopping_cart</span>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                            Mi Carrito ({getItemCount()})
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                    >
                        <span className="material-icons-outlined text-slate-500">close</span>
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <span className="material-icons-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                                shopping_cart
                            </span>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Tu carrito está vacío
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                                ¡Añade productos para empezar!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item: CartItem) => (
                                <div
                                    key={item.product.id}
                                    className="flex gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                                >
                                    {/* Imagen */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white dark:bg-slate-700 flex-shrink-0">
                                        <Image
                                            src={getDisplayImage(item.product)}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-2">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-primary font-bold mt-1">
                                            ${item.product.currentPrice.toFixed(2)}
                                        </p>

                                        {/* Controles de cantidad */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                                            >
                                                <span className="material-icons-outlined text-sm">remove</span>
                                            </button>
                                            <span className="w-8 text-center font-medium text-slate-700 dark:text-slate-300">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                                            >
                                                <span className="material-icons-outlined text-sm">add</span>
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="ml-auto p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
                                            >
                                                <span className="material-icons-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Botón limpiar carrito */}
                            <button
                                onClick={clearCart}
                                className="w-full py-2 text-sm text-slate-500 hover:text-red-500 transition flex items-center justify-center gap-1"
                            >
                                <span className="material-icons-outlined text-sm">delete_sweep</span>
                                Vaciar carrito
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer con total y botón WhatsApp */}
                {items.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Total:</span>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                ${getTotal().toFixed(2)}
                            </span>
                        </div>

                        {/* Botón WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                width={24}
                                height={24}
                                className="filter brightness-0 invert"
                                alt="WhatsApp"
                            />
                            <span>Pedir por WhatsApp</span>
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
