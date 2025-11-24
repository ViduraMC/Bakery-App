// Strategy Pattern: Payment Strategy Interface
class IPaymentStrategy {
    async processPayment(amount, paymentDetails) {
        throw new Error('Method not implemented');
    }

    getName() {
        throw new Error('Method not implemented');
    }
}

module.exports = IPaymentStrategy;
