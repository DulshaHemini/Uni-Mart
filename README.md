# 🛍️ UniMart — Student Marketplace

**UniMart** is a student-focused online marketplace that allows university students to **buy and sell new and used products** within their community.

The goal of UniMart is to make it easier for students to find affordable products, sell items they no longer need, and connect with other students through a simple and secure online marketplace.

> 🚧 **UniMart is currently under active development.**

---

## 🌐 Vision

UniMart aims to become a trusted marketplace for university students, starting with a small student community and gradually expanding to support students from multiple universities.

The platform is designed around a simple idea:

**Students can sell what they don't need and find what they need from other students.**

---

## 🎯 What UniMart Provides

### 🛒 For Buyers

Students can:

* Browse available products
* Search for products
* Filter products by category and other criteria
* View detailed product information
* Add products to their shopping cart
* Manage their cart
* Checkout
* Place orders
* Manage their profile

### 🏪 For Sellers

Students can:

* Create a seller account
* Create product listings
* Upload product information and images
* Set product prices
* Update product listings
* Remove products
* Manage their products
* View orders related to their products

### 🛡️ For Administrators

Administrators can:

* Manage users
* Manage products
* Monitor marketplace activity
* Manage reported or inappropriate content
* Manage the overall platform

---

## ✨ Core Features

* 🔐 User registration and login
* 🔑 JWT authentication
* 👤 User profiles
* 🛍️ Product marketplace
* 🔍 Product search
* 🏷️ Product categories
* 🎯 Product filtering
* 🛒 Shopping cart
* 📦 Order management
* 💳 Checkout
* 🏪 Seller dashboard
* 🛡️ Admin dashboard
* 🔒 Role-based authorization
* 🔐 Password hashing with bcrypt

---

## 💳 Payment Options

UniMart is designed to support multiple payment methods.

Planned payment options include:

* 🏦 Bank/account transfer with payment receipt upload
* 💵 Cash on Delivery
* 💳 PayHere online payments

Payment functionality will be implemented progressively as the platform develops.

---

## 👥 User Roles

| Role      | Description                                        |
| --------- | -------------------------------------------------- |
| 👤 Buyer  | Browse products and purchase items                 |
| 🏪 Seller | List and manage products for sale                  |
| 🛡️ Admin | Manage users, products, and marketplace activities |

A user may potentially participate as both a **buyer and seller**, depending on the final system design.

---

## 🖥️ Main Pages

### Public

* Home
* Login
* Register

### Marketplace

* Products / Shop
* Product Details
* Search
* Categories
* Product Filtering

### Buyer

* Cart
* Checkout
* Orders
* Profile

### Seller

* Seller Dashboard
* Add Product
* Manage Products
* Seller Orders

### Administrator

* Admin Dashboard
* User Management
* Product Management
* Marketplace Management

---

## 🏗️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* bcrypt
* dotenv
* Protected API routes
* Role-based authorization

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman

---

## 🏛️ System Architecture

UniMart uses the **MERN stack** and follows a client-server architecture.

```text
┌───────────────────────────────┐
│         React Frontend        │
│                               │
│ Pages / Components / Services │
│              │                │
└──────────────┼────────────────┘
               │
               │ REST API
               ▼
┌───────────────────────────────┐
│       Node.js + Express       │
│                               │
│ Routes / Controllers /        │
│ Middleware / Authentication   │
│              │                │
└──────────────┼────────────────┘
               │
               │ Mongoose
               ▼
┌───────────────────────────────┐
│            MongoDB            │
│                               │
│ Users / Products / Orders     │
│ Categories / Cart / Payments │
└───────────────────────────────┘
```

---

## 📂 Project Structure

```text
Uni-Mart/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

> The structure may change as UniMart continues to evolve.

---

## 🔐 Security

Security is an important part of UniMart because the platform will handle user accounts, products, orders, and potentially payments.

The system uses or plans to use:

* Password hashing with bcrypt
* JWT authentication
* Protected API endpoints
* Role-based access control
* Environment variables for sensitive information
* Input validation
* Secure database access
* Authentication middleware

Sensitive credentials such as database connection strings and JWT secrets will **never be committed to the repository**.

---

## 🔄 Marketplace Flow

```text
                         ┌──────────────┐
                         │    UniMart   │
                         │     Home     │
                         └──────┬───────┘
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ▼             ▼             ▼
             Products         Login        Register
                  │             │
                  ▼             ▼
          Product Details   Authentication
                  │             │
                  ▼             ▼
                Cart       User Dashboard
                  │
                  ▼
              Checkout
                  │
                  ▼
             Place Order
```

---

## 🚀 Future Plans

UniMart is intended to grow beyond a basic academic project.

Potential future features include:

* ⭐ Product reviews and ratings
* ❤️ Wishlist
* 💬 Buyer-seller messaging
* 🔔 Notifications
* 📦 Order tracking
* 📊 Seller analytics
* 🔍 Personalized product recommendations
* 📱 Mobile-friendly experience
* 💳 Online payment integration
* 📧 Email notifications
* 🚨 Product/user reporting
* 🏫 University-based marketplace communities
* 🏪 Seller verification
* 🔎 Advanced marketplace search
* 🛡️ Fraud and suspicious-activity protection

---

## 🗺️ Development Roadmap

### Phase 1 — Foundation

* [ ] Project specification
* [ ] Use case analysis
* [ ] Database design
* [ ] Backend setup
* [ ] User registration
* [ ] Password hashing
* [ ] User login
* [ ] JWT generation
* [ ] JWT authentication middleware

### Phase 2 — Marketplace

* [ ] Product management
* [ ] Product categories
* [ ] Product search
* [ ] Product filtering
* [ ] Product details
* [ ] Seller dashboard

### Phase 3 — Shopping

* [ ] Shopping cart
* [ ] Checkout
* [ ] Order placement
* [ ] Order management

### Phase 4 — Payments

* [ ] Bank transfer receipt upload
* [ ] Cash on Delivery
* [ ] PayHere integration

### Phase 5 — Community

* [ ] Product reviews
* [ ] Ratings
* [ ] Buyer-seller communication
* [ ] Notifications
* [ ] Reporting system

### Phase 6 — Production

* [ ] Production deployment
* [ ] Domain setup
* [ ] HTTPS
* [ ] Security testing
* [ ] Performance optimization
* [ ] User testing
* [ ] Initial student-community launch

---

## 📚 Project Background

UniMart was initially developed as an **individual project for the ICT2142 – E-Business module**.

However, the project is being developed with the intention of becoming a **real-world student marketplace** rather than remaining only as an academic demonstration.

The initial target audience is university students and the surrounding student community.

---

## 👩‍💻 Developer

**Dulsha Hemini**

Full-stack developer and creator of UniMart.

GitHub: [DulshaHemini](https://github.com/DulshaHemini)

---

## 📄 License

The licensing terms for UniMart will be defined as the project moves toward public deployment.

---

## ⭐ Support the Project

If you find UniMart interesting, consider giving the repository a ⭐ on GitHub and following the development of the project.

---

**UniMart — Buy. Sell. Connect. 🎓🛍️**
