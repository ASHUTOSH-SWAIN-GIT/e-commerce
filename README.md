# E-Commerce Marketplace Backend

This project is a full-stack **E-Commerce Marketplace Backend** with user authentication, product management, cart functionality, and a checkout system that supports discount coupons.

## Tech Stack
- **Backend Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Token)
- **API Testing**: Postman

---
## **1. Installation and Setup**

### **1.1 Clone the repository**
```sh
git clone https://github.com/your-repo.git
cd your-repo
```

### **1.2 Install dependencies**
```sh
npm install
```

### **1.3 Setup environment variables**
Create a **.env** file in the root directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **1.4 Start the server**
```sh
npm start
```
---
## **2. API Endpoints**

### **2.1 Authentication Routes** (`/api/auth`)
| Method | Endpoint         | Description                |
|--------|----------------|----------------------------|
| POST   | `/register`    | Register a new user       |
| POST   | `/login`       | User login and get JWT    |

#### **Request Body - Register**
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "buyer" // or "seller"
}
```

#### **Request Body - Login**
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

---
### **2.2 Product Routes** (`/api/products`)
| Method | Endpoint       | Description                          |
|--------|--------------|--------------------------------------|
| POST   | `/add`       | Add a new product (seller only)     |
| GET    | `/category/:categoryName` | Get all products in a category |
| PUT    | `/update/:productId` | Update product (seller only)  |
| DELETE | `/delete/:productId` | Delete product (seller only)  |

#### **Request Body - Add Product**
```json
{
  "name": "Nike Air Max",
  "description": "Running shoes",
  "price": 100,
  "category": "Shoes",
  "stock": 50,
  "sellerId": "seller_object_id"
}
```

---
### **2.3 Cart Routes** (`/api/cart`)
| Method | Endpoint       | Description                   |
|--------|--------------|-------------------------------|
| POST   | `/add`       | Add product to cart (buyer only) |
| GET    | `/` | View cart items (buyer only) |
| DELETE | `/remove/:productId` | Remove product from cart |

#### **Request Body - Add to Cart**
```json
{
  "username": "johndoe",
  "productId": "product_object_id",
  "quantity": 2
}
```

---
### **2.4 Checkout Routes** (`/api/checkout`)
| Method | Endpoint       | Description                         |
|--------|--------------|-------------------------------------|
| POST   | `/process`   | Checkout cart and apply discount if available |

#### **Request Body - Checkout**
```json
{
  "username": "johndoe",
  "couponCode": "DISCOUNT10"
}
```

---
### **2.5 Coupon Routes** (`/api/coupons`)
| Method | Endpoint       | Description                         |
|--------|--------------|-------------------------------------|
| POST   | `/create`    | Create a discount coupon (seller only) |

#### **Request Body - Create Coupon**
```json
{
  "sellerId": "seller_object_id",
  "code": "DISCOUNT10",
  "discountAmount": 10
}
```

---
## **3. Middleware & Authentication**
- **JWT Authentication**: Every protected route requires a valid JWT token.
- **Role-Based Access**: Sellers can only manage their own products, and buyers can only manage their own carts.

---
## **4. Error Handling**
All errors return structured JSON responses with appropriate HTTP status codes:
```json
{
  "message": "Unauthorized access"
}
```

---
## **5. Future Improvements**
- Implement payment gateway integration.
- Add order tracking functionality.
- Improve security measures.

---
## **6. License**
This project is licensed under the MIT License.
 this u have given for buyer give add endpoints for seller also
