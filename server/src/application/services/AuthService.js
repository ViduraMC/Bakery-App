const User = require('../../domain/entities/User');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(username, password) {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        if (username.toLowerCase() === 'admin') {
            throw new Error('Cannot register as admin');
        }

        const user = new User({ username, password, role: 'user' });
        return await this.userRepository.create(user);
    }

    async login(username, password) {
        const user = await this.userRepository.findByUsername(username);
        if (!user || !user.validatePassword(password)) {
            throw new Error('Invalid username or password');
        }
        return { username: user.username, role: user.role };
    }
}

module.exports = AuthService;
