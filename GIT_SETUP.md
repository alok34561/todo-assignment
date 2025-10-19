# Git Repository Setup

## Initialize Git Repository

```bash
# Navigate to project root
cd task-management-dashboard

# Initialize git repository
git init

# Add all files (respecting .gitignore)
git add .

# Initial commit
git commit -m "Initial commit: Task Management Dashboard with Laravel, React, and Socket.io"
```

## Connect to Remote Repository

### Option 1: Create new repository on GitHub/GitLab
```bash
# Add remote origin
git remote add origin https://github.com/yourusername/task-management-dashboard.git

# Push to remote
git branch -M main
git push -u origin main
```

### Option 2: Clone existing repository
```bash
# Clone the repository
git clone https://github.com/yourusername/task-management-dashboard.git
cd task-management-dashboard

# Install dependencies for each component
cd backend && composer install && cd ..
cd frontend && npm install && cd ..
cd socket-server && npm install && cd ..
```

## Repository Structure

```
task-management-dashboard/
├── .gitignore              # Root level ignores
├── README.md               # Main documentation
├── GIT_SETUP.md           # This file
├── backend/               # Laravel API
│   ├── .gitignore         # Laravel specific ignores
│   ├── .env.example       # Environment template
│   └── ...
├── frontend/              # React application
│   ├── .gitignore         # React specific ignores
│   └── ...
└── socket-server/         # Socket.io server
    ├── .gitignore         # Node.js specific ignores
    └── ...
```

## What's Ignored

### Root Level
- `*.bat` files (Windows batch files)
- `*.log` files
- IDE files (.vscode/, .idea/)
- OS files (.DS_Store, Thumbs.db)

### Backend (Laravel)
- `/vendor/` (Composer dependencies)
- `.env` files (environment variables)
- `/database/database.sqlite` (SQLite database)
- `/storage/logs/` (Laravel logs)
- `/node_modules/` (if using Laravel Mix)

### Frontend (React)
- `/node_modules/` (npm dependencies)
- `/build/` and `/dist/` (build outputs)
- `.env*` files (environment variables)
- `npm-debug.log*` (npm logs)

### Socket Server (Node.js)
- `/node_modules/` (npm dependencies)
- `.env*` files (environment variables)
- `npm-debug.log*` (npm logs)

## Setup After Clone

```bash
# 1. Backend setup
cd backend
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate

# 2. Frontend setup
cd ../frontend
npm install

# 3. Socket server setup
cd ../socket-server
npm install

# 4. Start all servers (from root)
cd ..
# Use separate terminals or batch file
```

## Common Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
```