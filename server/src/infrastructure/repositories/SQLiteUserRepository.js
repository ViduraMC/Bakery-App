const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');
const dbConnection = require('../database/DatabaseConnection');

class SQLiteUserRepository extends IUserRepository {
    constructor() {
        super();
        this.db = dbConnection.getDb();
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row ? new User(row) : null);
            });
        });
    }

    async create(user) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
                [user.id, user.username, user.password, user.role],
                (err) => {
                    if (err) reject(err);
                    else resolve(user);
                }
            );
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row ? new User(row) : null);
            });
        });
    }
}

module.exports = SQLiteUserRepository;
