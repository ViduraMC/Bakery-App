const IObserver = require('./IObserver');

class InventoryObserver extends IObserver {
    update(event, data) {
        if (event === 'ORDER_CREATED') {
            console.log(`[InventoryObserver] Stock reduced for order ${data.orderId}`);
            // In a real system, this could trigger:
            // - Low stock alerts
            // - Automatic reordering
            // - Analytics updates
        }
    }
}

module.exports = InventoryObserver;
