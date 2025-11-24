const IOrderRepository = require('../../domain/repositories/IOrderRepository');
const { Order, OrderItem } = require('../../domain/entities/Order');
const dbConnection = require('../database/DatabaseConnection');
const { v4: uuidv4 } = require('uuid');

class SQLiteOrderRepository extends IOrderRepository {
    constructor() {
        super();
        this.db = dbConnection.getDb();
    }

    async create(order) {
        return new Promise((resolve, reject) => {
            this.db.run('BEGIN TRANSACTION');

            this.db.run(
                'INSERT INTO orders (id, customer_name, customer_email, total_amount, status) VALUES (?, ?, ?, ?, ?)',
                [order.id, order.customerName, order.customerEmail, order.totalAmount, order.status],
                (err) => {
                    if (err) {
                        this.db.run('ROLLBACK');
                        return reject(err);
                    }

                    let completed = 0;
                    const totalItems = order.items.length;

                    if (totalItems === 0) {
                        this.db.run('COMMIT');
                        return resolve(order);
                    }

                    order.items.forEach((item) => {
                        this.db.run(
                            'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
                            [item.id, order.id, item.productId, item.quantity, item.price],
                            (err) => {
                                if (err) {
                                    this.db.run('ROLLBACK');
                                    return reject(err);
                                }

                                // Update product quantity
                                this.db.run(
                                    'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                                    [item.quantity, item.productId],
                                    (err) => {
                                        if (err) {
                                            this.db.run('ROLLBACK');
                                            return reject(err);
                                        }

                                        completed++;
                                        if (completed === totalItems) {
                                            this.db.run('COMMIT');
                                            resolve(order);
                                        }
                                    }
                                );
                            }
                        );
                    });
                }
            );
        });
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id || ':' || oi.quantity || ':' || oi.price) as items_str
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, (err, rows) => {
                if (err) reject(err);
                else {
                    const orders = rows.map(row => {
                        const items = row.items_str ? row.items_str.split(',').map(itemStr => {
                            const [productId, quantity, price] = itemStr.split(':');
                            return new OrderItem({
                                id: uuidv4(), // We don't store item IDs in this simple query, generating new one for object
                                productId,
                                quantity: parseInt(quantity),
                                price: parseFloat(price)
                            });
                        }) : [];

                        return new Order({
                            id: row.id,
                            customerName: row.customer_name,
                            customerEmail: row.customer_email,
                            totalAmount: row.total_amount,
                            status: row.status,
                            items
                        });
                    });
                    resolve(orders);
                }
            });
        });
    }

    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE orders SET status = ? WHERE id = ?',
                [status, id],
                (err) => {
                    if (err) reject(err);
                    else resolve({ id, status });
                }
            );
        });
    }
}

module.exports = SQLiteOrderRepository;
