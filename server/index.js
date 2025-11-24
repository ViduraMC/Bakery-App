const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const path = require('path');

// Infrastructure
const dbConnection = require('./src/infrastructure/database/DatabaseConnection');
const SQLiteUserRepository = require('./src/infrastructure/repositories/SQLiteUserRepository');
const SQLiteProductRepository = require('./src/infrastructure/repositories/SQLiteProductRepository');
const SQLiteOrderRepository = require('./src/infrastructure/repositories/SQLiteOrderRepository');

// Application
const AuthService = require('./src/application/services/AuthService');
const ProductService = require('./src/application/services/ProductService');
const OrderService = require('./src/application/services/OrderService');

// Strategy Pattern - Payment Strategies
const CashPaymentStrategy = require('./src/application/strategies/CashPaymentStrategy');
const CreditCardPaymentStrategy = require('./src/application/strategies/CreditCardPaymentStrategy');

// Observer Pattern - Observers
const InventoryObserver = require('./src/application/observers/InventoryObserver');
const NotificationObserver = require('./src/application/observers/NotificationObserver');

// Interface
const AuthController = require('./src/interfaces/http/controllers/AuthController');
const ProductController = require('./src/interfaces/http/controllers/ProductController');
const OrderController = require('./src/interfaces/http/controllers/OrderController');
const routes = require('./src/interfaces/http/routes');

// Dependency Injection Container (Manual)
const userRepository = new SQLiteUserRepository();
const productRepository = new SQLiteProductRepository();
const orderRepository = new SQLiteOrderRepository();

const authService = new AuthService(userRepository);
const productService = new ProductService(productRepository);

// Initialize OrderService with Cash payment strategy by default
const cashPaymentStrategy = new CashPaymentStrategy();
const orderService = new OrderService(orderRepository, productRepository, cashPaymentStrategy);

// Subscribe observers to OrderService (Observer Pattern)
const inventoryObserver = new InventoryObserver();
const notificationObserver = new NotificationObserver();
orderService.subscribe(inventoryObserver);
orderService.subscribe(notificationObserver);

const authController = new AuthController(authService);
const productController = new ProductController(productService);
const orderController = new OrderController(orderService);

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const path = require('path');

// Infrastructure
const dbConnection = require('./src/infrastructure/database/DatabaseConnection');
const SQLiteUserRepository = require('./src/infrastructure/repositories/SQLiteUserRepository');
const SQLiteProductRepository = require('./src/infrastructure/repositories/SQLiteProductRepository');
const SQLiteOrderRepository = require('./src/infrastructure/repositories/SQLiteOrderRepository');

// Application
const AuthService = require('./src/application/services/AuthService');
const ProductService = require('./src/application/services/ProductService');
const OrderService = require('./src/application/services/OrderService');

// Strategy Pattern - Payment Strategies
const CashPaymentStrategy = require('./src/application/strategies/CashPaymentStrategy');
const CreditCardPaymentStrategy = require('./src/application/strategies/CreditCardPaymentStrategy');

// Observer Pattern - Observers
const InventoryObserver = require('./src/application/observers/InventoryObserver');
const NotificationObserver = require('./src/application/observers/NotificationObserver');

// Interface
const AuthController = require('./src/interfaces/http/controllers/AuthController');
const ProductController = require('./src/interfaces/http/controllers/ProductController');
const OrderController = require('./src/interfaces/http/controllers/OrderController');
const routes = require('./src/interfaces/http/routes');

// Dependency Injection Container (Manual)
const userRepository = new SQLiteUserRepository();
const productRepository = new SQLiteProductRepository();
const orderRepository = new SQLiteOrderRepository();

const authService = new AuthService(userRepository);
const productService = new ProductService(productRepository);

// Initialize OrderService with Cash payment strategy by default
const cashPaymentStrategy = new CashPaymentStrategy();
const orderService = new OrderService(orderRepository, productRepository, cashPaymentStrategy);

// Subscribe observers to OrderService (Observer Pattern)
const inventoryObserver = new InventoryObserver();
const notificationObserver = new NotificationObserver();
orderService.subscribe(inventoryObserver);
orderService.subscribe(notificationObserver);

const authController = new AuthController(authService);
const productController = new ProductController(productService);
const orderController = new OrderController(orderService);

// Register CORS
fastify.register(cors, {
  origin: true
});

// Register Routes
fastify.register(routes, {
  authController,
  productController,
  orderController
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://0.0.0.0:${port}`);
    console.log('Payment Strategy: Cash (default)');
    console.log('Observers: Inventory, Notification');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();