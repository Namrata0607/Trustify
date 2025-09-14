import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Hero with Get Started Card */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Side - Main Tagline */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Rate. Trust. 
              <span className=" text-blue-600"> Manage. </span>
              <span className="block text-gray-700 text-2xl lg:text-3xl font-medium mt-2">
                — A Transparent Store Rating Platform.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Trustify connects Admins, Store Owners, and Users in a secure ecosystem where ratings build credibility.
            </p>
          </div>

          {/* Right Side - Get Started Section */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Get Started Today</h3>
                  <p className="text-gray-600">
                    Join thousands of businesses and users building trust together.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link 
                    to="/signup" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block text-center"
                  >
                    Get Started
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span>or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  <Link 
                    to="/login" 
                    className="w-full border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 inline-block text-center"
                  >
                    Already have an account? Sign In
                  </Link>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-center space-x-8 text-sm text-gray-500">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">10K+</div>
                      <div>Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">500+</div>
                      <div>Stores</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">50K+</div>
                      <div>Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections Below */}
        <div className="max-w-4xl mx-auto space-y-16">
          {/* What is Trustify */}
          <div className="text-justify space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">What is Trustify?</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                Trustify is a revolutionary platform that transforms how businesses and customers interact through ratings and reviews. We create a transparent ecosystem where trust is built through authentic feedback and verified experiences.
                Our platform serves three key stakeholders: <span className="font-semibold text-blue-600">Administrators</span> who ensure platform integrity, <span className="font-semibold text-purple-600">Store Owners</span> who gain valuable insights to improve their services, and <span className="font-semibold text-green-600">Users</span> who share honest reviews to help others make informed decisions.
                By combining advanced security measures with user-friendly interfaces, Trustify eliminates fake reviews while promoting genuine customer experiences. Every rating matters, every review counts, and every interaction builds a stronger community of trust.
              </p>
              {/* <p className="text-gray-600 leading-relaxed">
                Our platform serves three key stakeholders: <span className="font-semibold text-blue-600">Administrators</span> who ensure platform integrity, <span className="font-semibold text-purple-600">Store Owners</span> who gain valuable insights to improve their services, and <span className="font-semibold text-green-600">Users</span> who share honest reviews to help others make informed decisions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By combining advanced security measures with user-friendly interfaces, Trustify eliminates fake reviews while promoting genuine customer experiences. Every rating matters, every review counts, and every interaction builds a stronger community of trust.
              </p> */}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 text-left">Key Features</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">Secure Admin Panel</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Advanced platform management with role-based access control and comprehensive security features.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">Store Owner Dashboard</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Comprehensive business insights with analytics, performance metrics, and customer feedback management.</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">User-Friendly Rating System</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Intuitive interface for customers to leave detailed reviews and ratings with photo uploads and categorization.</p>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">Real-Time Analytics</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Live reporting dashboard with instant insights, trend analysis, and performance tracking across all metrics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Trustify - Enhanced UI */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 text-left">Why Choose Trustify?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-blue-900 mb-2 text-lg">Transparency</h4>
                <p className="text-blue-700 text-sm">Open and honest rating system with complete visibility</p>
              </div>

              <div className="group text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-bold text-green-900 mb-2 text-lg">Security</h4>
                <p className="text-green-700 text-sm">Enterprise-grade protection for user data and privacy</p>
              </div>

              <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-purple-900 mb-2 text-lg">Reliability</h4>
                <p className="text-purple-700 text-sm">Verified and authentic reviews you can trust</p>
              </div>

              <div className="group text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-orange-900 mb-2 text-lg">Growth</h4>
                <p className="text-orange-700 text-sm">Help businesses improve and scale effectively</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
