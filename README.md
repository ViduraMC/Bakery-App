# Sweet Delights Bakery App

A comprehensive bakery management system built to demonstrate enterprise-grade software engineering principles, clean architecture, and industry-standard design patterns.

## 🎯 Project Overview

This full-stack application showcases professional software development practices including:
- **Clean Architecture** (Layered Architecture)
- **Object-Oriented Programming (OOP)** principles
- **Design Patterns** (6 patterns implemented)
- **Optimized Data Structures** for performance
- **Algorithm Implementation** for core functionality

## 🏗️ Architecture

### Backend: Clean Architecture (Onion Architecture)

The backend follows **Clean Architecture** principles with clear separation of concerns:

```
server/
├── src/
│   ├── domain/              # Core Business Logic (Independent Layer)
│   │   ├── entities/        # Business entities with encapsulated logic
│   │   └── repositories/    # Repository interfaces (abstractions)
│   ├── application/         # Use Cases / Business Rules
│   │   ├── services/        # Application services
│   │   ├── strategies/      # Strategy Pattern implementations
│   │   └── observers/       # Observer Pattern implementations
│   ├── infrastructure/      # External Concerns (SQLite, Database)
│   │   ├── database/        # Database connection (Singleton)
│   │   └── repositories/    # Concrete repository implementations
│   └── interfaces/          # External Interfaces (HTTP)
│       └── http/
│           ├── controllers/ # Request handlers
│           └── routes/      # Route definitions
└── index.js                 # Dependency Injection Container
```

**Why Clean Architecture?**
- ✅ Business logic is independent of frameworks
- ✅ Testable without UI, database, or external agencies
- ✅ Database and framework can be swapped without affecting core logic
- ✅ Clear dependency rule: outer layers depend on inner layers, never vice versa

### Frontend: Service-Oriented Component Architecture

```
client/
├── services/        # API abstraction layer
│   ├── apiClient.ts
│   ├── AuthService.ts
│   ├── ProductService.ts
│   └── OrderService.ts
├── hooks/           # Custom React hooks (Business logic)
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useCart.ts
└── app/             # UI Components (Presentation)
```

**Benefits:**
- ✅ Separation of concerns (UI ← Logic ← Data)
- ✅ Reusable business logic via custom hooks
- ✅ Centralized API communication
- ✅ Easy to test components and services independently

## 🧩 Object-Oriented Programming (OOP)

### 1. Encapsulation
All business entities are implemented as classes with private data and public methods:

```javascript
class Product extends BaseEntity {
  constructor({ id, name, price, quantity }) {
    super(id);
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  updateStock(amount) {
    if (this.quantity + amount < 0) {
      throw new Error('Insufficient stock');
    }
    this.quantity += amount;
  }

  isInStock() {
    return this.quantity > 0;
  }
}
```

**Benefit**: Internal state is protected, and invariants (e.g., stock can't be negative) are enforced.

### 2. Abstraction
Interfaces (abstract classes) define contracts without implementation:

```javascript
class IProductRepository {
  async findAll() { throw new Error('Not implemented'); }
  async create(product) { throw new Error('Not implemented'); }
  // ... other methods
}
```

**Benefit**: Core logic depends on abstractions, not concrete implementations. Database can be swapped without changing services.

### 3. Inheritance
Base classes provide shared functionality:

```javascript
class BaseEntity {
  constructor(id) {
    this.id = id || uuidv4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

class Product extends BaseEntity { /* inherits id, createdAt, updatedAt */ }
class Order extends BaseEntity { /* inherits id, createdAt, updatedAt */ }
```

### 4. Polymorphism
Multiple implementations of the same interface:

```javascript
// Payment strategies - all implement IPaymentStrategy
cashStrategy.processPayment(100);      // Processes as cash
creditCardStrategy.processPayment(100); // Processes as credit card
```

**Benefit**: Payment method can be swapped at runtime without changing OrderService.

## 🎨 Design Patterns

### 1. **Singleton Pattern**
**Where**: `DatabaseConnection.js`

```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    this.db = new sqlite3.Database('./bakery.db');
    DatabaseConnection.instance = this;
  }
}
module.exports = new DatabaseConnection();
```

**Why**: Ensures only one database connection exists throughout the application lifecycle.

### 2. **Repository Pattern**
**Where**: All data access logic

```javascript
// Interface
class IProductRepository {
  async findAll() { }
  async create(product) { }
}

// Concrete implementation
class SQLiteProductRepository extends IProductRepository {
  async findAll() {
    // SQLite-specific logic
  }
}
```

**Why**: Abstracts data access, making the application database-agnostic.

### 3. **Dependency Injection (DI)**
**Where**: `server/index.js`

```javascript
const userRepository = new SQLiteUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
```

**Why**: Promotes loose coupling, easier testing, and flexibility.

### 4. **Strategy Pattern**
**Where**: Payment processing

```javascript
class OrderService {
  constructor(orderRepo, productRepo, paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  async createOrder(orderData, paymentDetails) {
    // Process payment using injected strategy
    await this.paymentStrategy.processPayment(total, paymentDetails);
  }
}
```

**Why**: Allows runtime selection of payment methods (Cash, CreditCard, PayPal, etc.) without modifying OrderService.

### 5. **Observer Pattern**
**Where**: Order event system

```javascript
class OrderService extends Observable {
  async createOrder(orderData) {
    const order = await this.orderRepository.create(order);
    
    // Notify all observers
    this.notify('ORDER_CREATED', { orderId: order.id });
    
    return order;
  }
}

// Observers automatically react
inventoryObserver.update('ORDER_CREATED', data); // Updates inventory
notificationObserver.update('ORDER_CREATED', data); // Sends email
```

**Why**: Decouples order creation from side effects. New observers can be added without modifying OrderService.

### 6. **Layered Architecture Pattern**
**Where**: Entire backend structure

**Why**: Clear separation of concerns, each layer has a specific responsibility.

## 📊 Data Structures

### 1. **HashMap (JavaScript Map)**
**Where**: Shopping cart in `useCart` hook

```typescript
const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

const addToCart = (product: Product) => {
  const item = cart.get(product.id); // O(1) lookup
  if (item) {
    cart.set(product.id, { ...item, quantity: item.quantity + 1 });
  }
};
```

**Complexity**: O(1) for lookups, inserts, and deletions

**Why**: Efficient product lookups in the cart by ID. Much faster than array search (O(n)).

### 2. **Arrays**
**Where**: Product lists, order items

```javascript
const products = await productRepository.findAll();
const total = order.items.reduce((sum, item) => sum + item.getTotal(), 0);
```

**Complexity**: O(n) for iteration, O(1) for push/pop

### 3. **Observer List**
**Where**: Observable pattern

```javascript
class Observable {
  constructor() {
    this.observers = []; // Array of observers
  }

  notify(event, data) {
    this.observers.forEach(observer => observer.update(event, data));
  }
}
```

## 🔢 Algorithms

### 1. **Aggregation / Reduction**
**Where**: Order total calculation

```javascript
calculateTotal() {
  return this.items.reduce((sum, item) => sum + item.getTotal(), 0);
}
```

**Complexity**: O(n) where n = number of items

### 2. **Linear Search**
**Where**: Product filtering, validation

```javascript
const product = products.find(p => p.id === searchId);
```

**Complexity**: O(n)

**Future Optimization**: Could implement binary search O(log n) if products are sorted, or use HashMap O(1).

### 3. **Stock Validation (Transaction)**
**Where**: Order creation with inventory check

```javascript
for (const item of orderData.items) {
  const product = await productRepository.findById(item.product_id);
  if (product.quantity < item.quantity) {
    throw new Error('Insufficient stock');
  }
}
```

**Complexity**: O(n × m) where n = items in order, m = database lookup time

## 🛠️ Tech Stack

### Backend (JavaScript)
- **Language**: **JavaScript (Node.js)** - All backend files are `.js`
- **Framework**: Fastify (fast HTTP server)
- **Database**: SQLite (with Repository pattern for easy swapping)
- **Architecture**: Clean Architecture / Layered Architecture
- **Why JavaScript?**: Node.js backend with strong OOP structure doesn't require TypeScript's type system

### Frontend (TypeScript)
- **Language**: **TypeScript** - All frontend files are `.ts` and `.tsx`
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Custom Hooks
- **HTTP Client**: Axios (abstracted via Service Layer)
- **Why TypeScript?**: Type safety for React props, state, and API responses enhances code quality

### Language Split Summary
```
Backend:  100% JavaScript (.js files in server/src/)
Frontend: 100% TypeScript (.ts/.tsx files in client/)
```

**For Learners**: The TypeScript used is beginner-friendly, covering essentials like:
- Type annotations (`: string`, `: number`)
- Interfaces for object shapes (`interface Product { ... }`)
- Generic types for hooks (`useState<string>`)

See `client/services/` and `client/hooks/` for practical TypeScript examples.

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bakery-App
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Seed the database**
   ```bash
   cd server
   node seed.js
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`

## 🔐 Demo Credentials

- **Admin**: username: `admin`, password: `12345`
- **User**: username: `user`, password: `12345`

## 📁 Key Files

### Backend Architecture (JavaScript)
- **Domain Entities**: `server/src/domain/entities/`
- **Repository Interfaces**: `server/src/domain/repositories/`
- **Services**: `server/src/application/services/`
- **Strategies**: `server/src/application/strategies/`
- **Observers**: `server/src/application/observers/`
- **DI Container**: `server/index.js`

### Frontend Architecture (TypeScript)
- **Services**: `client/services/` (`.ts` files)
- **Hooks**: `client/hooks/` (`.ts` files)
- **Components**: `client/app/` (`.tsx` files)

## 🎓 Learning Outcomes

This project demonstrates:

1. **Enterprise-grade architecture** suitable for scaling
2. **SOLID principles** in practice
3. **Clean Code** with clear separation of concerns
4. **Testability** through dependency injection and abstractions
5. **Maintainability** through design patterns
6. **Performance** through optimized data structures
7. **Modern tooling** (TypeScript for frontend, JavaScript for backend)


## 📝 License

MIT License

---

**Built with ❤️ to showcase Software Engineering Excellence**
