class IOrderRepository {
    async create(order) {
        throw new Error('Method not implemented');
    }

    async findAll() {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async updateStatus(id, status) {
        throw new Error('Method not implemented');
    }
}

module.exports = IOrderRepository;
