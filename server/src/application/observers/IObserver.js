// Observer Pattern: Observer Interface
class IObserver {
    update(event, data) {
        throw new Error('Method not implemented');
    }
}

module.exports = IObserver;
