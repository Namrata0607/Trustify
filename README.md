# Trustify - Transparent Store Rating Platform

Trustify is a modern web application for rating and reviewing stores with transparent user feedback. It features a robust admin dashboard, user management, store owner management, and a responsive, mobile-friendly UI. Built with React (Vite), Node.js/Express, Prisma ORM, and PostgreSQL (NeonDB).

Trustify is hosted on https://trustify-mocha.vercel.app

## Project Structure

```
Trustify/
├── frontend/              # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   │   ├── admin/     # Admin dashboard components
│   │   │   ├── owner/      # Store owner dashboard components
│   │   │   ├── user/      # User dashboard components
│   │   │   ├── Footer.jsx # Footer component
│   │   │   ├── Navbar.jsx # Navigation component
│   │   │   └── AutocompleteInput.jsx
│   │   ├── pages/         # Main pages
│   │   │   ├── Home.jsx   # Landing page
│   │   │   ├── Login.jsx  # Authentication
│   │   │   ├── Signup.jsx # User registration
│   │   │   ├── AdminModule.jsx    # Admin dashboard
│   │   │   ├── UserModule.jsx     # User dashboard
│   │   │   └── OwnerModule.jsx    # Store owner dashboard
│   │   ├── context/       # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/       # Layout components
│   │   │   └── UserLayout.jsx
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js     # API helpers
│   │   └── assets/        # Images, SVGs
│   ├── index.html         # Main HTML file
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── vercel.json        # Vercel deployment config
│
├── backend/               # Backend (Node.js + Express)
│   ├── src/               # Source code
│   │   ├── controllers/   # Route controllers
│   │   │   ├── authController.js      # Authentication logic
│   │   │   ├── userController.js      # User management
│   │   │   ├── adminController.js     # Admin operations
│   │   │   └── storeOwnerController.js # Store owner operations
│   │   ├── middleware/    # Express middlewares
│   │   │   ├── authMiddleware.js      # JWT authentication
│   │   │   ├── errorHandler.js        # Error handling
│   │   │   └── validateInput.js       # Input validation
│   │   ├── routes/        # API route definitions
│   │   │   ├── authRoutes.js          # Auth endpoints
│   │   │   ├── userRoutes.js          # User endpoints
│   │   │   ├── adminRoutes.js         # Admin endpoints
│   │   │   ├── storeOwnerRoutes.js    # Store owner endpoints
│   │   │   └── ratingRoutes.js        # Rating endpoints
│   │   ├── config/        # Configuration files
│   │   │   └── db.js      # Database configuration
│   │   ├── utils/         # Utility functions
│   │   │   └── jwtHelper.js
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── prisma/            # Prisma ORM
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Database seeding
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
├── README.md              # Project documentation
└── .gitignore             # Git ignore rules
```

## Features

### Core Features
- **Multi-role Authentication** - Users, Store Owners, and Admins
- **Store Rating System** - Transparent ratings and reviews
- **Admin Dashboard** - Complete platform management
- **Store Owner Dashboard** - Business analytics and management
- **User Dashboard** - Personal ratings and store browsing
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Dynamic content updates
- **Advanced Search** - Store filtering and pagination
- **Profile Management** - User and store owner profiles

### User Features
- Browse and search verified stores
- Submit authentic ratings and reviews
- View personal rating history
- Secure profile management
- Advanced filtering options

### Store Owner Features  
- Comprehensive business dashboard
- Real-time rating analytics
- Customer feedback management
- Business profile updates
- Rating trend analysis

### Admin Features
- Complete platform oversight
- User and store management
- Content moderation tools
- Analytics and reporting
- System configuration

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL (NeonDB recommended)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Namrata0607/Trustify.git
   cd Trustify
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd ../frontend && npm install
   ```

3. **Configure environment variables:**

  **Backend (`.env`):**
  ```env
  DATABASE_URL="postgresql://neondb_owner:<password>@<neon-host>/<db-name>?sslmode=require"
  JWT_SECRET="your_jwt_secret_here"
  ```

  **Frontend (`.env`):**
  ```env
  VITE_API_BASE_URL=http://localhost:3000  # Set this to your backend base URL
  ```


4. **Database setup:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the application:**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2) 
   cd frontend
   npm run dev
   ```

6. **Access the app:**
   - Local: http://localhost:5173
   - Live: https://trustify-mocha.vercel.app

## Admin Credentials

**Email:** admin@trustify.com  
**Password:** Trustify@1000

## Sample User Credentials

**Email:** aayushdaphale@gmail.com  
**Password:** A@yush1234

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user/ Admin / Store onwer
- `PUT /api/auth/update-password` - Update password

### Admin 
- `POST /api/admin/add-users` - Create new user
- `POST /api/admin/add-stores` - Create new store  
- `GET /api/admin/dashboard` - Dashboard analytics and stats
- `GET /api/admin/stores` - Get all stores with filters
- `GET /api/admin/users` - Get all users with filters
- `PUT /api/admin/stores/:storeId` - Update store details
- `DELETE /api/admin/stores/:storeId` - Delete store
- `DELETE /api/admin/users/:userId` - Delete user

### User
- `GET /api/users/stores` - Get all stores
- `POST /api/users/stores/rate` - Submit or update rating for store
- `GET /api/users/my-ratings` - Get current user's ratings history
- `DELETE /api/users/stores/rate` - Delete a rating

### Store Owner
- `GET /api/store-owners/my-store/ratings` - Get ratings for owner's store
- `GET /api/store-owners/my-store/average-rating` - Get average rating for owner's store

## Tech Stack

### Frontend
- **React 18+** - UI library with hooks
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing  
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - SVG icon library

### Backend  
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Frontend:** Vercel
- **Backend:** Render  
- **Database:** NeonDB (PostgreSQL)

## Contact

**Developer:** Namrata Daphale  
**Email:** namratadaphale07@gmail.com  
**GitHub:** [Namrata0607](https://github.com/Namrata0607)

For support or questions, feel free to reach out!