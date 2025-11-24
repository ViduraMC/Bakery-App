const BaseEntity = require('./BaseEntity');

class User extends BaseEntity {
    constructor({ id, username, password, role }) {
        super(id);
        this.username = username;
        this.password = password;
        this.role = role;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    validatePassword(inputPassword) {
        // In a real app, use bcrypt.compareSync(inputPassword, this.password)
        return this.password === inputPassword;
    }
}

module.exports = User;
