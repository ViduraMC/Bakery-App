class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    async getAllProducts(request, reply) {
        try {
            const products = await this.productService.getAllProducts();
            return reply.send(products);
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    }

    async getProductById(request, reply) {
        try {
            const { id } = request.params;
            const product = await this.productService.getProductById(id);
            return reply.send(product);
        } catch (error) {
            return reply.code(404).send({ error: error.message });
        }
    }

    async createProduct(request, reply) {
        try {
            const product = await this.productService.createProduct(request.body);
            return reply.send(product);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }

    async updateProduct(request, reply) {
        try {
            const { id } = request.params;
            const product = await this.productService.updateProduct(id, request.body);
            return reply.send(product);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }

    async deleteProduct(request, reply) {
        try {
            const { id } = request.params;
            await this.productService.deleteProduct(id);
            return reply.send({ message: 'Product deleted successfully' });
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }
}

module.exports = ProductController;
