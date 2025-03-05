# E-Commerce Marketplace API

## Overview
This is a backend API for an E-Commerce Marketplace with Order Management, User Authentication, Product Management, Cart Functionality, and Discount Coupons. It allows buyers to purchase products, manage their balance, apply discount coupons, and sellers to add products and generate coupons.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)

## Installation

1. Clone the repository:
```bash
    git clone https://github.com/your-repo/ecommerce-api.git
```
2. Install dependencies:
```bash
    cd ecommerce-api
    npm install
```
3. Set up environment variables (`.env` file):
```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
```
4. Start the server:
```bash
    npm start
```

---

## API Routes & Endpoints

### **Authentication**

#### **Register User**
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user as a buyer or seller.
- **Request Body:**
```json
{
  "username": "buyer123",
  "password": "securepassword",
  "role": "buyer"
}
```
- **Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### **Login User**
- **Endpoint:** `POST /api/auth/login`
- **Description:** Logs in a user and returns a JWT token.
- **Request Body:**
```json
{
  "username": "buyer123",
  "password": "securepassword"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### **Product Management (Sellers Only)**

#### **Add a Product**
- **Endpoint:** `POST /api/products`
- **Description:** Sellers can add products to the marketplace.
- **Headers:** `{ Authorization: Bearer <token> }`
- **Request Body:**
```json
{
  "name": "Running Shoes",
  "description": "Best shoes for runners",
  "price": 120,
  "category": "Shoes",
  "stock": 10,
  "sellerId": "seller123"
}
```
- **Response:**
```json
{
  "message": "Product added successfully",
  "product": {
    "_id": "product_id",
    "name": "Running Shoes",
    "price": 120
  }
}
```

#### **Get Products by Category**
- **Endpoint:** `GET /api/products/category/:category`
- **Description:** Fetch all products under a specific category.
- **Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Running Shoes",
    "price": 120
  }
]
```

### **Cart Management (Buyers Only)**

#### **Add Item to Cart**
- **Endpoint:** `POST /api/cart/add`
- **Request Body:**
```json
{
  "username": "buyer123",
  "productId": "product_id",
  "quantity": 2
}
```
- **Response:**
```json
{
  "message": "Product added to cart successfully"
}
```

#### **View Cart**
- **Endpoint:** `GET /api/cart/:username`
- **Response:**
```json
{
  "products": [
    {
      "product": {
        "name": "Running Shoes",
        "price": 120
      },
      "quantity": 2
    }
  ],
  "totalPrice": 240
}
```

### **Checkout with Discount Coupon**

#### **Apply Coupon and Checkout**
- **Endpoint:** `POST /api/cart/checkout`
- **Request Body:**
```json
{
  "username": "buyer123",
  "couponCode": "SAVE50"
}
```
- **Response:**
```json
{
  "message": "Checkout successful!",
  "discountApplied": 50,
  "remainingBalance": 950,
  "totalSpent": 150
}
```

### **Seller Coupon Management**

#### **Create a Discount Coupon**
- **Endpoint:** `POST /api/coupons`
- **Description:** Sellers can create discount coupons for buyers.
- **Request Body:**
```json
{
  "code": "SAVE50",
  "discount": 50,
  "sellerId": "seller123",
  "expirationDate": "2025-12-31"
}
```
- **Response:**
```json
{
  "message": "Coupon created successfully"
}
```

#### **Get All Coupons by Seller**
- **Endpoint:** `GET /api/coupons/:sellerId`
- **Response:**
```json
[
  {
    "code": "SAVE50",
    "discount": 50,
    "expirationDate": "2025-12-31"
  }
]
```

---

## Error Handling
Errors will be returned in the following format:
```json
{
  "message": "Error description here"
}
```

---

## Authentication & Authorization
- Users get a **JWT Token** upon login.
- Buyers can **add to cart, checkout, and apply coupons**.
- Sellers can **add products and create discount coupons**.
- Protected routes require an **Authorization Header** with a valid JWT token.

---


