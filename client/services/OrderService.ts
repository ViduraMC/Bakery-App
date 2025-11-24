import apiClient from './apiClient';

export interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
}

export interface CreateOrderRequest {
    customer_name: string;
    customer_email: string;
    items: OrderItem[];
    total_amount: number;
}

class OrderService {
    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        const response = await apiClient.post('/orders', orderData);
        return response.data;
    }

    async getAllOrders(): Promise<Order[]> {
        const response = await apiClient.get('/orders');
        return response.data;
    }

    async updateOrderStatus(id: string, status: string): Promise<{ id: string; status: string }> {
        const response = await apiClient.put(`/orders/${id}/status`, { status });
        return response.data;
    }
}

export default new OrderService();
