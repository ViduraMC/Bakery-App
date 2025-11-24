const IPaymentStrategy = require('./IPaymentStrategy');

class CreditCardPaymentStrategy extends IPaymentStrategy {
    async processPayment(amount, paymentDetails) {
        // Simulate credit card validation and processing
        const { cardNumber, cvv, expiryDate } = paymentDetails;

        // Simple validation
        if (!cardNumber || !cvv || !expiryDate) {
            throw new Error('Invalid credit card details');
        }

        console.log(`Processing credit card payment of $${amount}`);

        // In real implementation, integrate with payment gateway (Stripe, PayPal, etc.)
        return {
            success: true,
            transactionId: `CC-${Date.now()}`,
            method: 'credit_card',
            amount,
            last4: cardNumber.slice(-4)
        };
    }

    getName() {
        return 'Credit Card';
    }
}

module.exports = CreditCardPaymentStrategy;
