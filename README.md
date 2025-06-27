# Sweet Delights Bakery App

A comprehensive bakery management system with inventory tracking, order management, and payment processing.

## Features

### Customer Features
- **Product Catalog**: Browse all available bakery products with images, descriptions, and prices
- **Real-time Inventory**: See current stock levels for each product
- **Shopping Cart**: Add items to cart and manage quantities
- **Checkout System**: Place orders with customer information
- **Order Tracking**: View order status and history

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Inventory Control**: Update product quantities and prices
- **Order Management**: View all orders and update their status
- **Dashboard**: Overview of total products, orders, and revenue
- **Real-time Updates**: Automatic inventory updates when orders are placed

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Fastify** - Web framework
- **SQLite** - Database
- **UUID** - Unique identifiers
- **CORS** - Cross-origin resource sharing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bakery-App
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 3001) and frontend development server (port 3000).

## Project Structure

```
Bakery-App/
├── client/                 # Frontend Next.js application
│   ├── app/               # Next.js app directory
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page component
│   ├── package.json       # Frontend dependencies
│   ├── next.config.js     # Next.js configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── postcss.config.js  # PostCSS configuration
├── server/                # Backend Node.js application
│   ├── index.js          # Main server file
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json
└── README.md            # This file
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

## Database Schema

### Products Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `price` (REAL, NOT NULL)
- `quantity` (INTEGER, NOT NULL)
- `category` (TEXT)
- `image_url` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Orders Table
- `id` (TEXT, PRIMARY KEY)
- `customer_name` (TEXT)
- `customer_email` (TEXT)
- `total_amount` (REAL, NOT NULL)
- `status` (TEXT, DEFAULT 'pending')
- `payment_intent_id` (TEXT)
- `created_at` (DATETIME)

### Order Items Table
- `id` (TEXT, PRIMARY KEY)
- `order_id` (TEXT, FOREIGN KEY)
- `product_id` (TEXT, FOREIGN KEY)
- `quantity` (INTEGER, NOT NULL)
- `price` (REAL, NOT NULL)

## Usage

### For Customers
1. Browse the product catalog on the main page
2. Click "Add to Cart" for desired items
3. Click the cart icon to view your cart
4. Fill in customer information and place order
5. View order status in the admin panel (if you have access)

### For Admins
1. Click "Admin Mode" to switch to admin interface
2. Use the dashboard to view statistics
3. Add new products using the "Add Product" button
4. Edit existing products by clicking the edit icon
5. Delete products using the delete icon
6. Manage orders by updating their status
7. Monitor inventory levels and revenue

## Features in Detail

### Inventory Management
- Automatic quantity updates when orders are placed
- Real-time stock level display
- Out-of-stock indicators
- Bulk product management

### Order Processing
- Complete order workflow from cart to completion
- Customer information collection
- Order status tracking
- Transaction management

### User Interface
- Responsive design for all devices
- Modern, clean interface
- Intuitive navigation
- Real-time updates

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Database
The application uses SQLite for simplicity. The database file (`bakery.db`) will be created automatically when the server starts.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository. 