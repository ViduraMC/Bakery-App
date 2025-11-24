const Product = require('../../domain/entities/Product');

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getAllProducts() {
        return await this.productRepository.findAll();
    }

    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData) {
        const product = new Product(productData);
        return await this.productRepository.create(product);
    }

    async updateProduct(id, productData) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        // Update fields
        Object.assign(product, productData);
        return await this.productRepository.update(product);
    }

    async deleteProduct(id) {
        return await this.productRepository.delete(id);
    }
}

module.exports = ProductService;
