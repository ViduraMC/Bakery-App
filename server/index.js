const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Initialize database
const db = new sqlite3.Database('./bakery.db');

// Create tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
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
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_intent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Order items table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    product_id TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Add users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed admin and sample user if not present
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (row.count === 0) {
      const adminId = uuidv4();
      const userId = uuidv4();
      db.run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', [adminId, 'admin', '12345', 'admin']);
      db.run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', [userId, 'user', '12345', 'user']);
    }
  });
});

// Register CORS
fastify.register(cors, {
  origin: true
});

// Routes

// Get all products
fastify.get('/api/products', async (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// Get single product
fastify.get('/api/products/:id', async (request, reply) => {
  const { id } = request.params;
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
});

// Add new product
fastify.post('/api/products', async (request, reply) => {
  const { name, description, price, quantity, category, image_url } = request.body;
  const id = uuidv4();
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO products (id, name, description, price, quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, price, quantity, category, image_url],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, description, price, quantity, category, image_url });
        }
      }
    );
  });
});

// Update product
fastify.put('/api/products/:id', async (request, reply) => {
  const { id } = request.params;
  const { name, description, price, quantity, category, image_url } = request.body;
  
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, quantity, category, image_url, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, description, price, quantity, category, image_url });
        }
      }
    );
  });
});

// Delete product
fastify.delete('/api/products/:id', async (request, reply) => {
  const { id } = request.params;
  
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'Product deleted successfully' });
      }
    });
  });
});

// Create order
fastify.post('/api/orders', async (request, reply) => {
  const { customer_name, customer_email, items, total_amount } = request.body;
  const order_id = uuidv4();
  
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION');
    
    // Create order
    db.run(
      'INSERT INTO orders (id, customer_name, customer_email, total_amount) VALUES (?, ?, ?, ?)',
      [order_id, customer_name, customer_email, total_amount],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          reject(err);
          return;
        }
        
        // Add order items and update product quantities
        let completed = 0;
        const totalItems = items.length;
        
        items.forEach((item) => {
          const item_id = uuidv4();
          
          // Add order item
          db.run(
            'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
            [item_id, order_id, item.product_id, item.quantity, item.price],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }
              
              // Update product quantity
              db.run(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    reject(err);
                    return;
                  }
                  
                  completed++;
                  if (completed === totalItems) {
                    db.run('COMMIT');
                    resolve({ 
                      order_id, 
                      customer_name, 
                      customer_email, 
                      total_amount,
                      items 
                    });
                  }
                }
              );
            }
          );
        });
      }
    );
  });
});

// Get all orders
fastify.get('/api/orders', async (request, reply) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT o.*, 
             GROUP_CONCAT(oi.product_id || ':' || oi.quantity || ':' || oi.price) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// Update order status
fastify.put('/api/orders/:id/status', async (request, reply) => {
  const { id } = request.params;
  const { status } = request.body;
  
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, status });
        }
      }
    );
  });
});

// Register endpoint
fastify.post('/api/register', async (request, reply) => {
  const { username, password } = request.body;
  if (!username || !password) {
    return reply.code(400).send({ error: 'Username and password required' });
  }
  if (username.toLowerCase() === 'admin') {
    return reply.code(400).send({ error: 'Cannot register as admin' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (user) {
      return reply.code(400).send({ error: 'Username already exists' });
    }
    const id = uuidv4();
    db.run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)', [id, username, password, 'user'], (err) => {
      if (err) {
        return reply.code(500).send({ error: 'Registration failed' });
      }
      return reply.send({ success: true });
    });
  });
});

// Login endpoint
fastify.post('/api/login', async (request, reply) => {
  const { username, password } = request.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (user) {
      return reply.send({ success: true, role: user.role, username: user.username });
    } else {
      return reply.code(401).send({ error: 'Invalid username or password' });
    }
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 