const BaseEntity = require('./BaseEntity');

class OrderItem extends BaseEntity {
    constructor({ id, productId, quantity, price }) {
        super(id);
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    getTotal() {
        return this.quantity * this.price;
    }

    toJSON() {
        return {
            id: this.id,
            product_id: this.productId,
            quantity: this.quantity,
            price: this.price
        };
    }
}

class Order extends BaseEntity {
    constructor({ id, customerName, customerEmail, items = [], status = 'pending', totalAmount }) {
        super(id);
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.items = items.map(item => item instanceof OrderItem ? item : new OrderItem(item));
        this.status = status;
        this.totalAmount = totalAmount || this.calculateTotal();
    }

    addItem(item) {
        this.items.push(item);
        this.totalAmount = this.calculateTotal();
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
    }

    complete() {
        this.status = 'completed';
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            customer_name: this.customerName,
            customer_email: this.customerEmail,
            total_amount: this.totalAmount,
            status: this.status,
            items: this.items.map(item => item.toJSON()),
            created_at: this.createdAt
        };
    }
}

module.exports = { Order, OrderItem };
