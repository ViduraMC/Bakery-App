const BaseEntity = require('./BaseEntity');

class Product extends BaseEntity {
    constructor({ id, name, description, price, quantity, category, imageUrl }) {
        super(id);
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    updateStock(amount) {
        if (this.quantity + amount < 0) {
            throw new Error('Insufficient stock');
        }
        this.quantity += amount;
        this.updatedAt = new Date();
    }

    isInStock() {
        return this.quantity > 0;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            quantity: this.quantity,
            category: this.category,
            image_url: this.imageUrl,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}

module.exports = Product;
