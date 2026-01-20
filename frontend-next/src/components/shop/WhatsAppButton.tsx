"use client";

import Link from "next/link";
import { Product } from "@/lib/data";

// Replace with actual number
const PHONE_NUMBER = "593999999999";

interface WhatsAppButtonProps {
    product: Product;
}

export function WhatsAppButton({ product }: WhatsAppButtonProps) {
    const message = `Hola, estoy interesado en ${product.name}`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    if (!product.inStock || product.stockCount === 0) {
        return (
            <button disabled className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                <span>Agotado</span>
                <span className="material-icons-outlined">block</span>
            </button>
        );
    }

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6 filter brightness-0 invert" alt="WhatsApp" />
            <span>Consultar por WhatsApp</span>
        </a>
    );
}
