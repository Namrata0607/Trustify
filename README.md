# 🌟 Trustify - Transparent Store Rating Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-blue" alt="React Version">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="Database">
  <img src="https://img.shields.io/badge/ORM-Prisma-purple" alt="Prisma ORM">
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-cyan" alt="Tailwind CSS">
</div>

## 🌐 Live Demo

<div align="center">
  <h3>
    <a href="https://trustify-mocha.vercel.app" target="_blank">
      🚀 Visit Live Application: https://trustify-mocha.vercel.app
    </a>
  </h3>
  <p><em>Experience Trustify in action! Click the link above to explore our platform.</em></p>
</div>

## 🚨 Important Notice

> **⚠️ Backend Hosting Information**  
> Our backend is hosted on **Render's free tier**, which may take a moment to start up from sleep mode. Please be patient during initial loading - the first request might take 30-60 seconds to respond.

## 🔐 Admin Credentials

For testing and demonstration purposes:

```
Email: admin@trustify.com
Password: Trustify@1000
```
---

## 🌟 Overview

**Trustify** is a revolutionary transparent store rating platform that connects three key stakeholders in a secure, trust-building ecosystem:

- **👥 Users** - Share authentic reviews and ratings
- **🏪 Store Owners** - Manage their business reputation and customer feedback
- **🛡️ Administrators** - Ensure platform integrity and moderate content

Our platform eliminates fake reviews while promoting genuine customer experiences, creating a community where every rating matters and trust is built through transparency.

---

## ✨ Features

### 🔹 **For Users**
- ✅ Browse and search verified stores
- ✅ Submit authentic ratings and reviews
- ✅ View personal rating history
- ✅ Secure user profile management
- ✅ Advanced search and filtering

### 🔹 **For Store Owners**
- ✅ Comprehensive business dashboard
- ✅ Real-time rating analytics
- ✅ Customer feedback management
- ✅ Profile and business information updates
- ✅ Rating trend analysis

### 🔹 **For Administrators**
- ✅ Complete platform oversight
- ✅ User and store management
- ✅ Content moderation tools
- ✅ Analytics and reporting
- ✅ System configuration

### 🔹 **Core Platform Features**
- 🔒 **Secure Authentication** - JWT-based with role-based access control
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔍 **Advanced Search** - Intelligent filtering and pagination
- 📊 **Real-time Analytics** - Live dashboards and statistics
- 🛡️ **Data Security** - Encrypted data storage and transmission
- ⚡ **Performance Optimized** - Fast loading and efficient queries

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18+** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **React Icons** - Comprehensive icon library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma ORM** - Type-safe database toolkit
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Zod** - TypeScript-first schema validation

### **Development & Deployment**
- **Git** - Version control
- **Render** - Cloud deployment platform
- **Vercel** - Frontend hosting platform

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│ (PostgreSQL)    │
│                 │    │                 │    │                 │
│ • Components    │    │ • REST APIs     │    │ • Users         │
│ • Pages         │    │ • AuthMiddleware│    │ • Stores        │
│ • Context       │    │ • Controllers   │    │ • Ratings       │
│ • Utils         │    │ • Validators    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Design Patterns**
- **Component-Based Architecture** - Reusable UI components
- **Context API** - Global state management
- **RESTful API Design** - Standard HTTP methods and status codes
- **Role-Based Access Control** - Secure route protection
- **Responsive Design** - Mobile-first approach

---

## 👥 User Roles

### 🛡️ **Administrator (ADMIN)**
- Complete platform control
- User and store management
- Content moderation
- System analytics
- Platform configuration

### 🏪 **Store Owner (STORE_OWNER)**
- Business dashboard access
- Customer rating insights
- Profile management
- Response to reviews
- Business analytics

### 👤 **Normal User (USER)**
- Store browsing and search
- Rating and review submission
- Personal profile management
- Rating history tracking
- Wishlist management

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ installed
- PostgreSQL database
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Namrata0607/Trustify.git
   cd Trustify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Database setup
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### **Environment Variables Setup**

**Backend (.env)**
```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_q4uVdxrYgKh8@ep-snowy-king-adl62mbh-pooler.c-2.us-east-1.aws.neon.tech/trustify_db?sslmode=require"

# JWT Configuration
JWT_SECRET="supersecretkey123"

```

**Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=https://trustify-r0jd.onrender.com

```

**🔒 Security Best Practices:**
- ✅ Never commit `.env` files to version control (already in `.gitignore`)
- ✅ Use different secrets for development and production environments
- ✅ Keep JWT secrets at least 32 characters long for security
- ✅ Use environment-specific database URLs
- ✅ Store production secrets securely in hosting platforms

**🛠️ Environment Setup Steps:**

1. **Backend Environment**
   ```bash
   cd backend
   cp .env.example .env  # Copy template
   # Edit .env file with your actual database credentials
   ```

2. **Frontend Environment**
   ```bash
   cd frontend
   cp .env.example .env  # Copy template
   # Edit .env file with your API URL
   ```

3. **Production Environment**
   - Set environment variables in your hosting platform (Render, Vercel, etc.)
   - Use secure, randomly generated JWT secrets
   - Configure production database URLs

---

## 🌐 Deployment

### **Backend Deployment (Render)**
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build and start commands
4. Deploy and monitor logs

### **Frontend Deployment (Vercel)**
1. Connect repository to Vercel
2. Configure build settings
3. Set environment variables
4. Deploy automatically on push

**🌐 Live Production Deployment:**
- **URL**: https://trustify-mocha.vercel.app
- **Status**: ✅ Active and Running
- **Auto-deploy**: Enabled on main branch updates

### **Database Hosting**
- **Production**: PostgreSQL hosted on [Neon](https://neon.tech)
- **Development**: PostgreSQL instance on Neon

---

## 🎯 Future Enhancements

- [ ] **Real-time Notifications** - WebSocket implementation
- [ ] **Advanced Analytics** - Detailed insights and reports
- [ ] **Mobile App** - React Native application
- [ ] **API Rate Limiting** - Prevent abuse and ensure fair usage
- [ ] **Email Verification** - Account verification system
- [ ] **Social Authentication** - Google/Facebook login
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Search Filters** - Location-based, category-wise
- [ ] **Review Moderation** - AI-powered content filtering
- [ ] **Business Verification** - Verified business badges
---

## 🙏 Thank You

Thank you for your interest in Trustify!  
We appreciate your support and feedback.  

---