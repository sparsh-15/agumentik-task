# Admin System Setup Guide

## Frontend Setup (Vite + React + Tailwind)

### 1. Install Dependencies
```bash
cd vite-project
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system.

### 3. Seed Admin User
```bash
npm run seed:admin
```

### 4. Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Default Admin Credentials
- Email: `admin@example.com`
- Password: `admin123`

## Features
- Admin login with JWT authentication
- Protected dashboard route
- Real-time product inventory with Socket.IO
- Tailwind CSS styling
- Responsive design

## Routes
- `/` - Redirects to admin login
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express + MongoDB + Socket.IO
- Authentication: JWT + bcryptjs
