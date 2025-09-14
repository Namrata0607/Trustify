// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';


const Home = lazy(() => import('./pages/Home'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const AdminModule = lazy(() => import('./pages/AdminModule'));
const OwnerModule = lazy(() => import('./pages/OwnerModule'));
const UserModule = lazy(() => import('./pages/UserModule'));

function AppContent() {
  const location = useLocation();
  const isModuleRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/owner') || location.pathname.startsWith('/user');

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      {!isModuleRoute && <Navbar />}
      <Routes>
        {/* Default route → Home */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminModule />} />
        <Route path="/owner" element={<OwnerModule />} />
        <Route path="/user" element={<UserModule />} />
      </Routes>
      {!isModuleRoute && <Footer />}
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
