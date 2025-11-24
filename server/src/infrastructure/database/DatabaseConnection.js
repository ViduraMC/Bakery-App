const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        this.db = new sqlite3.Database('./bakery.db');
        this.init();
        DatabaseConnection.instance = this;
    }

    getDb() {
        return this.db;
    }

    init() {
        this.db.serialize(() => {
            // Products table
            this.db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        category TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Orders table
            this.db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_email TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_intent_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // Order items table
            this.db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        product_id TEXT,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )`);

            // Users table
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
        });
    }
}

module.exports = new DatabaseConnection();
