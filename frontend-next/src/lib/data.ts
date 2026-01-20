export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
    stockCount: number;
    category: string;
    image: string;
}

export const products: Product[] = [
    {
        id: "1",
        name: "Pieza de Mano de Alta Velocidad",
        price: 125.00,
        description: "Instrumento rotatorio de alta precisión para procedimientos dentales. Diseño ergonómico y bajo ruido.",
        inStock: true,
        stockCount: 15,
        category: "Instrumentos",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIhDtcuYfoLNoMvQ9-_i6A2zvK3eJbsiuegMAPHuRImcow_q9zn1Rc39Tj7d6wwRaltU9RnYCxjMIr7a1J1B4hZ0P4jUhZPzOGH0STbwTbgOIpmT0mb9xN8oH5MXOTVD11ggPWLKGmCVurUD-2AfERmyw6uT9HybnHijqISyTtvCUWevGErvJlfAihp_nY2VYri-IydFxCQPTYrRTPqRqBerpK0C9V3oj3POyMR-2a-1y9pR_vCCpMW1QvHftZex_a3HPOC-l4GLc",
    },
    {
        id: "2",
        name: "Kit de Examen Básico (7 pzas)",
        price: 45.50,
        description: "Set completo para exploración intraoral. Incluye espejo, explorador y pinza algodonera de acero inoxidable.",
        inStock: true,
        stockCount: 20,
        category: "Kits",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHWwvHl1AYnb8lPtr1aOw5F-xl1A1fmzzQNIR3_OoA3tiKJXHk5QSPQTcungR5XUUj9AIcJYwXPeidRvgDlSQBG-warAP7xlnHMb-y-g4-oxaJnTVVcJvFzNZIA1yX-Ms0Z9_xhhk41L6-3-g0m6QwRWBwLDUYp6YprmJ9cFLUaQEDz0pCAcYUsWDyvIoxMrmhKbBtF5mSiGGB-ikC_oWWaawRnh3Gs0mT8_T4n16hl3hgz4TROyrt5gKRBOS_OqDLlLUYd9ZKBtI",
    },
    {
        id: "3",
        name: "Modelo de Estudio Typodont",
        price: 89.00,
        description: "Modelo anatómico con dientes removibles para prácticas de restauración y ortodoncia.",
        inStock: true,
        stockCount: 3,
        category: "Educación",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVwljafj9v8NwewezaUDceAa57PGEB-6kmkRg54wnzMyXqnUoiofxnb8yFO7-JEvXWnMuThlb6oco6KDTWqLnq4Nsta-0F6M5W4JM1WeUUNMIqRrfjjKRCIt6LqCiCOVrXTy2NVpTI_0VanDjCZR7iSA4sYt1ReyCna24FAZBGUKFhFIzRIjFuwZgm89UQPCdV4CvM74bV9fMPP-HnJNQakepcF66vCc3nGqyYA8KY-PlbYabHDAgv5tutmWmKAxAfsW5qINowfVM",
    },
    {
        id: "4",
        name: "Mascarillas Quirúrgicas 3 Capas",
        price: 12.99,
        description: "Caja de 50 unidades. Alta filtración bacteriana y comodidad para uso prolongado.",
        inStock: true,
        stockCount: 100,
        category: "Consumibles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYaVCH08YfuPsM8mDW-OCSaM9z9Wx_8W-OXE9ZhCeotofQUyrQHAWuNZ2FD2FoBlfClsAGI9IH4DJe368SVAi9DQ2o_g-MCWCYzAKvMZeiQr_vkWyfw12Bgow4v5XbAn-B1G6JxpiI7EkSX7RruUK5rTjN-Pb_fZ5FidcZKsiwX1DVPi3YO-hANYvnYVh7hUFJmFW3MRNWkWD3HSUAlf2hEOXW8ORTuiADiBTq1-C0zUx8rVAU0UmKbfXhK9Tsz_3910ZV2QoNOEE",
    },
    {
        id: "5",
        name: "Resina Compuesta Z350",
        price: 55.00,
        description: "Resina nanohíbrida para restauraciones anteriores y posteriores. Excelente pulido y estética.",
        inStock: false,
        stockCount: 0,
        category: "Consumibles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHljTdnVYft2c7ZWc8aB_pE_eLdeZZ63McpTyXh8C4E2qhJQQ9EVyMN6W-ksSSOhQHasEYIkYzxk2Yn3XzxpUukE6GhyTpWm7xNn3gPgouQzEOppCbF0GqDNOHKmTIYCQ0UixuGOO1hvW_cMeQp_k21cNg2JJoVF0HtbTCC9A8DKV9JC5LSu6ndR0ehbd9gRw6p-2DH9vOmWh7WsZMsNDerzpHKP954nWLwjqn9w6nYDYGdYqEZF-U-TyAe-k9gntxcYxOw2MQnDs", // Reuse image for now or use placeholder
    },
];
