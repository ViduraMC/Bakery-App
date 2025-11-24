class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(request, reply) {
        try {
            const { username, password } = request.body;
            if (!username || !password) {
                return reply.code(400).send({ error: 'Username and password required' });
            }
            const result = await this.authService.register(username, password);
            return reply.send({ success: true, userId: result.id });
        } catch (error) {
            return reply.code(400).send({ error: error.message });
        }
    }

    async login(request, reply) {
        try {
            const { username, password } = request.body;
            const result = await this.authService.login(username, password);
            return reply.send({ success: true, ...result });
        } catch (error) {
            return reply.code(401).send({ error: error.message });
        }
    }
}

module.exports = AuthController;
