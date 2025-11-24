const IObserver = require('./IObserver');

class NotificationObserver extends IObserver {
    update(event, data) {
        if (event === 'ORDER_CREATED') {
            console.log(`[NotificationObserver] Sending order confirmation to ${data.customerEmail}`);
            // In a real system, this could:
            // - Send email via SendGrid/AWS SES
            // - Send SMS notifications
            // - Push notifications
        }
    }
}

module.exports = NotificationObserver;
