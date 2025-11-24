const { v4: uuidv4 } = require('uuid');
const dbConnection = require('./src/infrastructure/database/DatabaseConnection');

const db = dbConnection.getDb();

const seedData = async () => {
  console.log('Starting database seed...');

  // 1. Seed Users
  await new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) return reject(err);

      if (row.count === 0) {
        const adminId = uuidv4();
        const userId = uuidv4();

        const stmt = db.prepare('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)');
        stmt.run(adminId, 'admin', '12345', 'admin');
        stmt.run(userId, 'user', '12345', 'user');
        stmt.finalize(() => {
          console.log('✅ Users created: admin/12345, user/12345');
          resolve();
        });
      } else {
        console.log('ℹ️ Users already exist');
        resolve();
      }
    });
  });

  // 2. Seed Products
  await new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) return reject(err);

      if (row.count === 0) {
        const products = [
          { name: 'Chocolate Muffin', description: 'Rich chocolate chip muffin', price: 120, quantity: 50, category: 'Muffins', image_url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&q=80' },
          { name: 'Croissant', description: 'Buttery flaky croissant', price: 150, quantity: 30, category: 'Pastries', image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80' },
          { name: 'Sourdough Bread', description: 'Freshly baked sourdough', price: 450, quantity: 15, category: 'Bread', image_url: 'https://images.unsplash.com/photo-1585476263060-b7a676b96339?w=500&q=80' },
          { name: 'Blueberry Cheesecake', description: 'Creamy cheesecake slice', price: 350, quantity: 20, category: 'Cakes', image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
          { name: 'Bagel', description: 'Classic plain bagel', price: 80, quantity: 40, category: 'Bread', image_url: 'https://images.unsplash.com/photo-1585476263060-b7a676b96339?w=500&q=80' }, // Placeholder image
          { name: 'Chocolate Cookie', description: 'Chewy chocolate cookie', price: 60, quantity: 100, category: 'Cookies', image_url: 'https://images.unsplash.com/photo-1499636138143-bd630f5cf386?w=500&q=80' }
        ];

        const stmt = db.prepare('INSERT INTO products (id, name, description, price, quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');

        products.forEach(p => {
          stmt.run(uuidv4(), p.name, p.description, p.price, p.quantity, p.category, p.image_url);
        });

        stmt.finalize(() => {
          console.log(`✅ Seeded ${products.length} products`);
          resolve();
        });
      } else {
        console.log('ℹ️ Products already exist');
        resolve();
      }
    });
  });

  console.log('🌱 Database seeding completed!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});