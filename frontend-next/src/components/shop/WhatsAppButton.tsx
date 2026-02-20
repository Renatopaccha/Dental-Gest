"use client";

import Image from "next/image";

// Número real de WhatsApp de Dental GEST_EC
const PHONE_NUMBER = "5930961340473";

export interface WhatsAppButtonProps {
    productName: string;
    inStock: boolean;
}

/**
 * Botón de WhatsApp para consultar sobre un producto.
 * Genera un mensaje dinámico con el nombre del producto.
 */
export function WhatsAppButton({ productName, inStock }: WhatsAppButtonProps) {
    const message = `Hola, estoy interesado en ${productName}`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    if (!inStock) {
        return (
            <button
                disabled
                className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
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
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                width={24}
                height={24}
                className="filter brightness-0 invert"
                alt="WhatsApp"
            />
            <span>Consultar por WhatsApp</span>
        </a>
    );
}
