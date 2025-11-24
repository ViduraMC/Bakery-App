import { useState, useEffect } from 'react';
import ProductService, { Product } from '../services/ProductService';
import toast from 'react-hot-toast';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await ProductService.getAllProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (product: Omit<Product, 'id'>) => {
        try {
            const newProduct = await ProductService.createProduct(product);
            setProducts([newProduct, ...products]);
            toast.success('Product created successfully');
            return newProduct;
        } catch (error) {
            toast.error('Failed to create product');
            throw error;
        }
    };

    const updateProduct = async (id: string, product: Partial<Product>) => {
        try {
            const updatedProduct = await ProductService.updateProduct(id, product);
            setProducts(products.map(p => p.id === id ? updatedProduct : p));
            toast.success('Product updated successfully');
            return updatedProduct;
        } catch (error) {
            toast.error('Failed to update product');
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await ProductService.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
            throw error;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, createProduct, updateProduct, deleteProduct, refetch: fetchProducts };
};
