import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Left side - About and Contact (Desktop) */}
          <div className="flex space-x-8">
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
            >
              Contact
            </Link>
          </div>

          {/* Center - TRUSTIFY Logo with Animation (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="group">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-wider relative overflow-hidden">
                <span className="inline-block transition-all duration-500 ">
                  TRUSTIFY
                </span>
                {/* <span className="inline-block transition-all duration-500 delay-75 group-hover:animate-bounce">
                  R
                </span>
                <span className="inline-block transition-all duration-500 delay-100 group-hover:animate-pulse">
                  U
                </span>
                <span className="inline-block transition-all duration-500 delay-150 group-hover:animate-bounce">
                  S
                </span>
                <span className="inline-block transition-all duration-500 delay-200 group-hover:animate-pulse">
                  T
                </span>
                <span className="inline-block transition-all duration-500 delay-250 group-hover:animate-bounce">
                  I
                </span>
                <span className="inline-block transition-all duration-500 delay-300 group-hover:animate-pulse">
                  F
                </span>
                <span className="inline-block transition-all duration-500 delay-350 group-hover:animate-bounce">
                  Y
                </span> */}
                
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-700 ease-out"></span>
                
                {/* Glow effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-blue-400 to-purple-500 blur-lg transition-opacity duration-500"></span>
              </h1>
            </Link>
          </div>

          {/* Right side - Keep empty for balance (Desktop) */}
          <div className="w-32"></div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex justify-between items-center h-16">
          {/* Mobile Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="group">
              <h1 className="text-xl font-bold text-gray-800 tracking-wider relative overflow-hidden">
                <span className="inline-block transition-all duration-500">
                  TRUSTIFY
                </span>
                {/* <span className="inline-block transition-all duration-500 delay-75 group-hover:animate-bounce">
                  R
                </span>
                <span className="inline-block transition-all duration-500 delay-100 group-hover:animate-pulse">
                  U
                </span>
                <span className="inline-block transition-all duration-500 delay-150 group-hover:animate-bounce">
                  S
                </span>
                <span className="inline-block transition-all duration-500 delay-200 group-hover:animate-pulse">
                  T
                </span>
                <span className="inline-block transition-all duration-500 delay-250 group-hover:animate-bounce">
                  I
                </span>
                <span className="inline-block transition-all duration-500 delay-300 group-hover:animate-pulse">
                  F
                </span>
                <span className="inline-block transition-all duration-500 delay-350 group-hover:animate-bounce">
                  Y
                </span> */}
                
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-700 ease-out"></span>
              </h1>
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;