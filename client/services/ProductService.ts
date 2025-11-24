import apiClient from './apiClient';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    imageUrl: string;
}

class ProductService {
    async getAllProducts(): Promise<Product[]> {
        const response = await apiClient.get('/products');
        return response.data;
    }

    async getProductById(id: string): Promise<Product> {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    }

    async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await apiClient.post('/products', product);
        return response.data;
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        const response = await apiClient.put(`/products/${id}`, product);
        return response.data;
    }

    async deleteProduct(id: string): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    }
}

export default new ProductService();
