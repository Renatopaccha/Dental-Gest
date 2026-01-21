/**
 * Servicio de API para consumir datos del backend Django
 */
import { Product, Category, PaginatedResponse, ProductDisplay, toProductDisplay } from '@/types/product';

// URL base de la API Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Obtiene todos los productos de la API
 * Maneja tanto respuestas paginadas como arrays directos
 */
export async function getProducts(options?: {
    category?: number;
    inStock?: boolean;
    search?: string;
    ordering?: string;
}): Promise<ProductDisplay[]> {
    try {
        const params = new URLSearchParams();

        if (options?.category) {
            params.append('category', options.category.toString());
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
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_URL}/categories/`, {
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
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(categoryId: number): Promise<ProductDisplay[]> {
    return getProducts({ category: categoryId });
}

/**
 * Busca productos por texto
 */
export async function searchProducts(query: string): Promise<ProductDisplay[]> {
    return getProducts({ search: query });
}
