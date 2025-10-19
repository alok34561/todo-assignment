# Real-Time Task Management Dashboard

A full-stack task management application with real-time updates built using Laravel (backend), React (frontend), and Socket.io (real-time communication).

## Features

- User authentication (login/register)
- CRUD operations for tasks
- Real-time updates across multiple browser sessions
- Task status management (pending, in-progress, done)
- Task filtering by status
- Responsive UI with Tailwind CSS

## Tech Stack

- **Backend:** Laravel 10+ with SQLite
- **Frontend:** React 18 with Vite
- **Real-time:** Node.js + Socket.io Server

## Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- npm

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Run database migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed

# Start Laravel development server
php artisan serve
```

**Backend runs at:** `http://localhost:8000`

### 2. Socket Server Setup

```bash
# Navigate to socket server directory
cd socket-server

# Install Node.js dependencies
npm install

# Start Socket.io server
npm start
```

**Socket server runs at:** `http://localhost:3001`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm run dev
```

**Frontend runs at:** `http://localhost:5173`

## Environment Configuration

### Backend (.env file)
After copying `.env.example` to `.env`, the file contains:

##### Database Info
database name `todo-app`


### Frontend & Socket Server
No additional environment configuration needed.

## Login Credentials

### Creating New Accounts
1. Go to `http://localhost:5173`


### Test Accounts (if seeder is run)
- **User 1:** Email: `admin@gmail.com`, Password: `admin@1234`
- **User 2:** Email: `user@gmail.com`, Password: `user@1234`

## How to Run All Servers

### Option 1: Manual (Recommended)
Open 3 separate terminals and run:

**Terminal 1 - Backend:**
```bash
cd backend
composer install/composer update
php artisan serve
```

**Terminal 2 - Socket Server:**
```bash
cd socket-server
npm install
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```



**Authentication issues:**
```javascript
// Clear browser storage
localStorage.clear();
sessionStorage.clear();
```

### Server Status Check
- Backend: `http://localhost:8000` should show Laravel welcome page
- Socket Server: Check terminal for "Socket.io server running" message
- Frontend: `http://localhost:5173` should show the application

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task