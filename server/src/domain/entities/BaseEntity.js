const { v4: uuidv4 } = require('uuid');

class BaseEntity {
    constructor(id) {
        this.id = id || uuidv4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    getId() {
        return this.id;
    }
}

module.exports = BaseEntity;
