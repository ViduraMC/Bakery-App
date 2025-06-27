const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./bakery.db');

const sampleProducts = [
  {
    id: uuidv4(),
    name: 'Chocolate Croissant',
    description: 'Buttery croissant filled with rich chocolate, perfect for breakfast or dessert.',
    price: 3.50,
    quantity: 25,
    category: 'Pastries',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Sourdough Bread',
    description: 'Traditional sourdough bread with a crispy crust and tangy flavor.',
    price: 4.99,
    quantity: 15,
    category: 'Bread',
    image_url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Blueberry Muffin',
    description: 'Moist muffin loaded with fresh blueberries and topped with a sweet crumb.',
    price: 2.99,
    quantity: 30,
    category: 'Muffins',
    image_url: 'https://images.unsplash.com/photo-1607958996338-0106c4dcd783?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Cinnamon Roll',
    description: 'Soft, fluffy cinnamon roll with cream cheese frosting and extra cinnamon.',
    price: 3.99,
    quantity: 20,
    category: 'Pastries',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Baguette',
    description: 'Classic French baguette with a crispy exterior and soft, airy interior.',
    price: 2.49,
    quantity: 18,
    category: 'Bread',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Chocolate Chip Cookie',
    description: 'Large, chewy chocolate chip cookies made with premium dark chocolate.',
    price: 1.99,
    quantity: 40,
    category: 'Cookies',
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Apple Pie',
    description: 'Homemade apple pie with flaky crust and sweet-tart apple filling.',
    price: 8.99,
    quantity: 8,
    category: 'Pies',
    image_url: 'https://images.unsplash.com/photo-1535920527002-b35e3f412d0f?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake with a graham cracker crust.',
    price: 12.99,
    quantity: 6,
    category: 'Cakes',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Banana Bread',
    description: 'Moist banana bread with walnuts and a hint of cinnamon.',
    price: 4.49,
    quantity: 12,
    category: 'Bread',
    image_url: 'https://images.unsplash.com/photo-1603046891744-76e6300df9e9?w=400&h=300&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Strawberry Danish',
    description: 'Flaky Danish pastry filled with fresh strawberry jam and cream.',
    price: 3.75,
    quantity: 16,
    category: 'Pastries',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop'
  }
];

db.serialize(() => {
  // Clear existing products
  db.run('DELETE FROM products', (err) => {
    if (err) {
      console.error('Error clearing products:', err);
      return;
    }
    console.log('Cleared existing products');
    
    // Insert sample products
    const stmt = db.prepare(`
      INSERT INTO products (id, name, description, price, quantity, category, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    sampleProducts.forEach(product => {
      stmt.run([
        product.id,
        product.name,
        product.description,
        product.price,
        product.quantity,
        product.category,
        product.image_url
      ], (err) => {
        if (err) {
          console.error('Error inserting product:', err);
        } else {
          console.log(`Added: ${product.name}`);
        }
      });
    });
    
    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement:', err);
      } else {
        console.log('Sample data inserted successfully!');
        db.close();
      }
    });
  });
}); 