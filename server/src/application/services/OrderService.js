const { Order, OrderItem } = require('../../domain/entities/Order');
const Observable = require('../observers/Observable');

class OrderService extends Observable {
    constructor(orderRepository, productRepository, paymentStrategy = null) {
        super(); // Initialize Observable
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentStrategy = paymentStrategy;
    }

    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }

    async createOrder(orderData, paymentDetails = {}) {
        // Verify stock for all items
        for (const item of orderData.items) {
            const product = await this.productRepository.findById(item.product_id);
            if (!product) {
                throw new Error(`Product ${item.product_id} not found`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
        }

        const orderItems = orderData.items.map(item => new OrderItem({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        const order = new Order({
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            items: orderItems,
            totalAmount: orderData.total_amount
        });

        // Process payment if strategy is set (Strategy Pattern)
        if (this.paymentStrategy) {
            try {
                const paymentResult = await this.paymentStrategy.processPayment(
                    order.totalAmount,
                    paymentDetails
                );
                console.log(`Payment processed via ${this.paymentStrategy.getName()}:`, paymentResult.transactionId);
            } catch (error) {
                throw new Error(`Payment failed: ${error.message}`);
            }
        }

        // Create the order in database
        const createdOrder = await this.orderRepository.create(order);

        // Notify observers (Observer Pattern)
        this.notify('ORDER_CREATED', {
            orderId: createdOrder.id,
            customerEmail: createdOrder.customerEmail,
            totalAmount: createdOrder.totalAmount,
            items: createdOrder.items
        });

        return createdOrder;
    }

    async getAllOrders() {
        return await this.orderRepository.findAll();
    }

    async updateOrderStatus(id, status) {
        const result = await this.orderRepository.updateStatus(id, status);

        // Notify observers of status change
        this.notify('ORDER_STATUS_UPDATED', {
            orderId: id,
            newStatus: status
        });

        return result;
    }
}

module.exports = OrderService;
