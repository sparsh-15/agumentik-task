# Admin Authentication System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Edit the `.env` file with your settings:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens
- `ADMIN_EMAIL`: Default admin email
- `ADMIN_PASSWORD`: Default admin password

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed Admin User
```bash
npm run seed:admin
```

### 5. Start the Server
```bash
npm run dev
```

## API Endpoints

### Authentication (Public)

#### Signup
- **POST** `/api/auth/signup`
- Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- Creates a new user account

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "john@example.com", "password": "password123" }`
- Returns JWT token and user info

### Admin Routes (Requires Admin Token)

#### Create User
- **POST** `/api/admin/create-user`
- Headers: `Authorization: Bearer <admin_token>`
- Body: `{ "name": "Jane Doe", "email": "jane@example.com", "password": "password123", "role": "user" }`

#### Get All Users
- **GET** `/api/admin/users`
- Headers: `Authorization: Bearer <admin_token>`

#### Delete User
- **DELETE** `/api/admin/users/:id`
- Headers: `Authorization: Bearer <admin_token>`

## Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

### Create User (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"New User\",\"email\":\"newuser@example.com\",\"password\":\"password123\"}"
```
