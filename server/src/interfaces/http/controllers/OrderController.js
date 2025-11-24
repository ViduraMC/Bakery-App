class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    async createOrder(request, reply) {
        try {
            const order = await this.orderService.createOrder(request.body);
            return reply.send(order);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }

    async getAllOrders(request, reply) {
        try {
            const orders = await this.orderService.getAllOrders();
            return reply.send(orders);
        } catch (error) {
            return reply.code(500).send({ error: error.message });
        }
    }

    async updateOrderStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status } = request.body;
            const result = await this.orderService.updateOrderStatus(id, status);
            return reply.send(result);
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }
}

module.exports = OrderController;
