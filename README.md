
# Laptop Sales Web Application (MERN Stack) - Final Year Project

This is a Full Stack web application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack for selling laptops online. The platform allows users to browse laptops, add them to their cart, and proceed with orders. Admin users can manage the product inventory and handle orders.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Introduction

This project is my Final Year Project developed as a complete solution for an e-commerce platform selling laptops online. It features a fully functional backend and a responsive frontend. The project demonstrates skills in both backend development using Node.js and Express.js, and frontend development using React.js, ensuring seamless communication between the client and server with the help of RESTful APIs.

## Features

- **User Authentication and Authorization**:
  - Secure login and registration.
  - JWT-based authentication.
  
- **Product Management**:
  - Add, update, and delete products (Admin only).
  - Product categorization.
  - Product details page.

- **Shopping Cart**:
  - Add products to cart.
  - Update product quantity in the cart.
  
- **Order Management**:
  - Place orders from the cart.
  - Track order status.
  - Admin controls for managing orders (from pending to success).

- **Responsive Design**:
  - Mobile-first design using Tailwind CSS for a modern and accessible UI.

## Technologies

### Frontend:
- **React.js**: Building reusable UI components and managing state.
- **React Router**: Handling dynamic routing in a single-page application.
- **Tailwind CSS**: For responsive and modern styling.

### Backend:
- **Node.js**: Backend runtime for handling server-side operations.
- **Express.js**: For building RESTful APIs.
- **MongoDB**: NoSQL database to store product, user, and order information.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT**: For user authentication and session management.

### Tools:
- **Postman**: API testing and development.
- **Git**: Version control.

## Project Structure

### Backend

The backend follows an MVC structure for clean separation of concerns:

```bash
backend/
├── src/
│   ├── config/          # Database and server configuration files
│   ├── controllers/     # Business logic for handling requests (Product, User, Order)
│   ├── middlewares/     # Middleware for authentication and error handling
│   ├── models/          # Mongoose models (Product, User, Order schemas)
│   ├── routes/          # API routes for different entities (Product, User, Order)
│   ├── utils/           # Utility functions for general purposes
├── app.js               # Entry point for the backend server
├── package.json         # Backend dependencies and scripts
```

### Frontend

The frontend is organized into a component-based structure:

```bash
frontend/
├── public/              # Public assets such as images and icons
├── src/
│   ├── api/             # API services to interact with the backend
│   ├── components/      # Reusable UI components (Navbar, ProductCard, etc.)
│   ├── constants/       # App-wide constants (API URLs, Configs)
│   ├── hooks/           # Custom React hooks for reusable logic
│   ├── layouts/         # Layout components for wrapping pages
│   ├── pages/           # Different pages (Home, Product Details, Cart, etc.)
│   ├── store/           # Redux store setup and slices for state management
│   ├── utils/           # Helper functions for the frontend
├── App.js               # Main component for the application
├── package.json         # Frontend dependencies and scripts
```

## Usage

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
  ```bash
   git clone https://github.com/yourusername/laptop-sales-mern.git
   ```

2. Install dependencies:

   **Backend**:
   ```bash
   cd backend
   npm install
   ```

   **Frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. Setup environment variables for the backend by creating a `.env` file in the `backend/` directory. Include variables like:
   ```bash
   MONGO_URI=<your-mongo-db-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Run the backend server:
   ```bash
   cd backend
   npm run dev
   ```

5. Run the frontend server:
   ```bash
   cd frontend
   npm start
   ```

6. Open `http://localhost:3000` to view the app.

## Documentation

1. **API Documentation**: The backend exposes several RESTful API endpoints, including:
   - `/api/products` for product management.
   - `/api/users` for user authentication.
   - `/api/orders` for handling orders.
   
   You can test the APIs using Postman or any other API client.

2. **Frontend Documentation**:
   - React components are split into logical folders such as `components`, `pages`, and `layouts`.
   - The state is managed using Redux for scalability.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Push to the branch (`git push origin feature-branch`).
5. Submit a pull request.
