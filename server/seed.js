const { v4: uuidv4 } = require('uuid');
const dbConnection = require('./src/infrastructure/database/DatabaseConnection');

const db = dbConnection.getDb();

// Seed admin and sample user if not present
db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
  if (err) {
    console.error('Error checking users:', err);
    process.exit(1);
  }

  if (row.count === 0) {
    const adminId = uuidv4();
    const userId = uuidv4();

    db.run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [adminId, 'admin', '12345', 'admin'],
      (err) => {
        if (err) {
          console.error('Error creating admin:', err);
        } else {
          console.log('Admin user created: admin/12345');
        }
      }
    );

    db.run('INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [userId, 'user', '12345', 'user'],
      (err) => {
        if (err) {
          console.error('Error creating user:', err);
        } else {
          console.log('Regular user created: user/12345');
          process.exit(0);
        }
      }
    );
  } else {
    console.log('Users already exist, skipping seed.');
    process.exit(0);
  }
});