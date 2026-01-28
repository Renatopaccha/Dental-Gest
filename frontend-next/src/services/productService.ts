/**
 * Servicio de API para consumir datos del backend Django
 */
import { Product, Category, Brand, PaginatedResponse, ProductDisplay, toProductDisplay } from '@/types/product';

// URL base de la API Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Opciones de filtrado para productos
 */
export interface GetProductsOptions {
    category?: string;      // slug o id
    brand?: string;         // slug o id
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    ordering?: string;
    audience?: string;      // STUDENT, PROFESSIONAL, GENERAL
}

/**
 * Obtiene todos los productos de la API con filtros opcionales
 * Maneja tanto respuestas paginadas como arrays directos
 */
export async function getProducts(options?: GetProductsOptions): Promise<ProductDisplay[]> {
    try {
        const params = new URLSearchParams();

        if (options?.category) {
            params.append('category', options.category);
        }
        if (options?.brand) {
            params.append('brand', options.brand);
        }
        if (options?.minPrice !== undefined) {
            params.append('min_price', options.minPrice.toString());
        }
        if (options?.maxPrice !== undefined) {
            params.append('max_price', options.maxPrice.toString());
        }
        if (options?.inStock !== undefined) {
            params.append('in_stock', options.inStock.toString());
        }
        if (options?.search) {
            params.append('search', options.search);
        }
        if (options?.ordering) {
            params.append('ordering', options.ordering);
        }
        if (options?.audience) {
            params.append('audience', options.audience);
        }

        const queryString = params.toString();
        const url = `${API_URL}/products/${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            cache: 'no-store', // Siempre obtener datos frescos
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // CORRECCIÓN: Manejo inteligente de paginación
        let products: Product[] = [];

        // Si Django envía paginación ({ results: [...] }), extraemos results
        if (data.results && Array.isArray(data.results)) {
            products = data.results;
        }
        // Si envía un array directo, usamos el array
        else if (Array.isArray(data)) {
            products = data;
        }

        // Convertir a formato de display
        return products.map(toProductDisplay);
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * Obtiene un producto por su ID
 */
export async function getProductById(id: number): Promise<ProductDisplay | null> {
    try {
        const response = await fetch(`${API_URL}/products/${id}/`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data: Product = await response.json();
        return toProductDisplay(data);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

/**
 * Obtiene todas las categorías
 * @param audience - Filtro opcional por audiencia (STUDENT, PROFESSIONAL, GENERAL)
 */
export async function getCategories(audience?: string): Promise<Category[]> {
    try {
        const params = new URLSearchParams();
        if (audience) {
            params.append('audience', audience);
        }
        const queryString = params.toString();
        const url = `${API_URL}/categories/${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Manejar paginación para categorías también
        if (data.results && Array.isArray(data.results)) {
            return data.results;
        }
        if (Array.isArray(data)) {
            return data;
        }

        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Obtiene todas las marcas
 * @param audience - Filtro opcional por audiencia (STUDENT, PROFESSIONAL, GENERAL)
 */
export async function getBrands(audience?: string): Promise<Brand[]> {
    try {
        const params = new URLSearchParams();
        if (audience) {
            params.append('audience', audience);
        }
        const queryString = params.toString();
        const url = `${API_URL}/brands/${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Manejar paginación para marcas también
        if (data.results && Array.isArray(data.results)) {
            return data.results;
        }
        if (Array.isArray(data)) {
            return data;
        }

        return [];
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductDisplay[]> {
    return getProducts({ category: categorySlug });
}

/**
 * Busca productos por texto
 */
export async function searchProducts(query: string): Promise<ProductDisplay[]> {
    return getProducts({ search: query });
}
