async function routes(fastify, options) {
    const { authController, productController, orderController } = options;

    // Auth Routes
    fastify.post('/api/register', authController.register.bind(authController));
    fastify.post('/api/login', authController.login.bind(authController));

    // Product Routes
    fastify.get('/api/products', productController.getAllProducts.bind(productController));
    fastify.get('/api/products/:id', productController.getProductById.bind(productController));
    fastify.post('/api/products', productController.createProduct.bind(productController));
    fastify.put('/api/products/:id', productController.updateProduct.bind(productController));
    fastify.delete('/api/products/:id', productController.deleteProduct.bind(productController));

    // Order Routes
    fastify.get('/api/orders', orderController.getAllOrders.bind(orderController));
    fastify.post('/api/orders', orderController.createOrder.bind(orderController));
    fastify.put('/api/orders/:id/status', orderController.updateOrderStatus.bind(orderController));
}

module.exports = routes;
