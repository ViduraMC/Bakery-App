const IPaymentStrategy = require('./IPaymentStrategy');

class CashPaymentStrategy extends IPaymentStrategy {
    async processPayment(amount, paymentDetails) {
        // Simulate cash payment processing
        console.log(`Processing cash payment of $${amount}`);
        return {
            success: true,
            transactionId: `CASH-${Date.now()}`,
            method: 'cash',
            amount
        };
    }

    getName() {
        return 'Cash';
    }
}

module.exports = CashPaymentStrategy;
