/**
 * Tipos de datos para productos - Coincide con la API de Django
 */

/**
 * Categoría de productos
 */
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    product_count: number;
}

/**
 * Imagen adicional de la galería de un producto
 */
export interface ProductImage {
    id: number;
    image: string;
    image_url: string | null;
    order: number;
}

/**
 * Producto tal como viene de la API de Django
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    discount_price: string | null;
    current_price: string;
    has_discount: boolean;
    discount_percentage: number;
    category: number;
    category_name: string;
    category_slug: string;
    stock_count: number;
    in_stock: boolean;
    stock_status: 'En Stock' | 'Poco Stock' | 'Agotado';
    image: string | null;
    image_url: string | null;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
}

/**
 * Respuesta paginada de la API de Django REST Framework
 */
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

/**
 * Tipo simplificado para usar en componentes
 */
export interface ProductDisplay {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    currentPrice: number;
    hasDiscount: boolean;
    discountPercentage: number;
    categoryName: string;
    stockCount: number;
    inStock: boolean;
    stockStatus: 'En Stock' | 'Poco Stock' | 'Agotado';
    imageUrl: string | null;
    images: ProductImage[];
}

/**
 * Convierte un producto de la API al formato de display
 */
export function toProductDisplay(product: Product): ProductDisplay {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        discountPrice: product.discount_price ? parseFloat(product.discount_price) : null,
        currentPrice: parseFloat(product.current_price),
        hasDiscount: product.has_discount,
        discountPercentage: product.discount_percentage,
        categoryName: product.category_name,
        stockCount: product.stock_count,
        inStock: product.in_stock,
        stockStatus: product.stock_status,
        imageUrl: product.image,
        images: product.images || [],
    };
}

/**
 * Obtiene la URL de imagen a mostrar para un producto.
 * Lógica de fallback: principal -> galería -> placeholder
 */
export function getDisplayImage(product: ProductDisplay): string {
    if (product.imageUrl) {
        return product.imageUrl;
    }

    if (product.images && product.images.length > 0 && product.images[0].image) {
        return product.images[0].image;
    }

    return '/file.svg';
}
