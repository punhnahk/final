
# Web Application to Sell Laptops Online

This is a full-stack web application designed for selling laptops online. The backend is built with Node JS, while the frontend is developed using React. The database used is MongoDB.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Documentation](#documentation)

## Introduction

This project provides an online platform for selling laptops. Users can browse laptops, add them to their shopping cart, and proceed to checkout. Admin users can manage the product listings.

## Features

- User authentication and authorization
- Browse products
- Add products to the shopping cart
- Update cart items (increase/decrease quantity, remove items)
- Order summary and checkout
- Admin panel for managing products
- ...

## Technologies

- **Backend:**
  - Node JS
  - Express JS
  - MongoDB
- **Frontend:**
  - React
  - Axios
  - React Router
- **Database:**
  - MongoDB

## Project Structure

### Backend (Server)
```bash
backend
├── config/
├── controllers/
│ ├── AutoCreateAdmin.js
│ ├── ProductController.js
│ └── UserController.js
├── models/
│ ├── ProductModel.js
│ └── UserModel.js
├── node_modules/
├── routers/
│ ├── ProductRouter.js
│ └── UserRouter.js
├── untis/
├── .env
├── index.js
├── package-lock.json
├── package.json
```
### Frontend (Client)
```bash

frontend

```

### Prerequisites

- Node.js and npm
- MongoDB
- ExpressJS

## Usage

- **Auto-create Admin User**

  On server startup, the application will automatically create an admin user if it does not already exist. The admin user details are as follows:

  - Name: `Admin`
  - Email: `Admin@admin.com`


## Documentation

[Documentation](https://linktodocumentation)
