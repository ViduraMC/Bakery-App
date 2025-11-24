const IProductRepository = require('../../domain/repositories/IProductRepository');
const Product = require('../../domain/entities/Product');
const dbConnection = require('../database/DatabaseConnection');

class SQLiteProductRepository extends IProductRepository {
    constructor() {
        super();
        this.db = dbConnection.getDb();
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => new Product({ ...row, imageUrl: row.image_url })));
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row ? new Product({ ...row, imageUrl: row.image_url }) : null);
            });
        });
    }

    async create(product) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO products (id, name, description, price, quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [product.id, product.name, product.description, product.price, product.quantity, product.category, product.imageUrl],
                (err) => {
                    if (err) reject(err);
                    else resolve(product);
                }
            );
        });
    }

    async update(product) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [product.name, product.description, product.price, product.quantity, product.category, product.imageUrl, product.id],
                (err) => {
                    if (err) reject(err);
                    else resolve(product);
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }
}

module.exports = SQLiteProductRepository;
