# SORETRAK - Website

## Quick Start

### Prerequisites
- Node.js (already installed)
- PostgreSQL (you need to install this)

### 1. Install PostgreSQL
Download and install from: https://www.postgresql.org/download/windows/

During installation:
- Set password (remember it!)
- Keep default port: 5432
- Set database name: `postgres`

### 2. Setup Backend
```bash
cd server

# Create the database
# Open pgAdmin or psql and run:
# CREATE DATABASE soretrak_db;

# Update .env with your PostgreSQL password
# Edit DATABASE_URL in server/.env

# Install Prisma schema
npm run db:push

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Access
- **Public Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000

### Admin Login
- Email: `admin@soretrak.com.tn`
- Password: `admin123`

## Features
- Arabic (RTL) + French (LTR) bilingual
- Responsive design inspired by FlixBus
- Orange (#FF6B00), Green (#2E7D32), White color scheme
- All links open in new tabs
- Chatbot with FAQ matching + OpenAI fallback
- Admin back-office for managing all content
- Same database for admin and public
