// Observer Pattern: Subject/Observable
class Observable {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(event, data) {
        this.observers.forEach(observer => {
            try {
                observer.update(event, data);
            } catch (error) {
                console.error(`Observer error for event ${event}:`, error);
            }
        });
    }
}

module.exports = Observable;
