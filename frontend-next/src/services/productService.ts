/**
 * Servicio de API para consumir datos del backend Django
 */
import { Product, Category, PaginatedResponse, ProductDisplay, toProductDisplay } from '@/types/product';

// URL base de la API Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Maneja errores de la API de forma controlada
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

/**
 * Obtiene todos los productos de la API
 * 
 * @param options - Opciones de filtrado
 * @returns Lista de productos o array vacío si hay error
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
            next: { revalidate: 60 }, // Cache por 60 segundos (ISR)
        });

        const data = await handleResponse<PaginatedResponse<Product>>(response);

        // Convertir a formato de display
        return data.results.map(toProductDisplay);
    } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Retorna array vacío si la API está caída
    }
}

/**
 * Obtiene un producto por su ID
 * 
 * @param id - ID del producto
 * @returns Producto o null si no existe
 */
export async function getProductById(id: number): Promise<ProductDisplay | null> {
    try {
        const response = await fetch(`${API_URL}/products/${id}/`, {
            next: { revalidate: 60 },
        });

        const data = await handleResponse<Product>(response);
        return toProductDisplay(data);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

/**
 * Obtiene todas las categorías
 * 
 * @returns Lista de categorías
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_URL}/categories/`, {
            next: { revalidate: 300 }, // Cache por 5 minutos
        });

        return await handleResponse<Category[]>(response);
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
