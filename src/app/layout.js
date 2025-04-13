"use client";

import Link from "next/link";
import "./globals.css";
import { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';

function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);




  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/BarterLogo.jpg" 
              alt="Barter Logo" 
              width={50} 
              height={40} 
              className="rounded-full"
            />
            {/* <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-all">
              Barter
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/listing/all" 
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
            >
              All Listings
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/listing/create" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
                >
                  Create Listing
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
                >
                  Dashboard
                </Link>

                {user.username == "group4" ? (
                  <Link 
                    href="/adminDashboard" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
                  >
                    Admin
                  </Link>
                ) : null}

                <Link 
                  href="/trade" 
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
                >
                  Trade
                </Link>

                <Link 
                  href="/chat"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
                >
                  Chat
                </Link>

                <Link 
                href="/notification"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                 <span className="mr-1">🔔 </span>
                Notifications
              </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700/50 transition-all"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed left-0 right-0 transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/80 backdrop-blur-lg shadow-lg">
          <Link 
            href="/listing/all"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
          >
            All Listings
          </Link>
          
          {user ? (
            <>
              <Link 
                href="/listing/create"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Create Listing
              </Link>
              <Link 
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Dashboard
              </Link>
              <Link 
                href="/trade"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Trade
              </Link>
              <Link 
                href="/chat"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Chat
              </Link>
              <Link 
                href="/notification"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-500/50 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700/50 transition-all"
              >
                Register
              </Link>
            </>
          )}
          
          
        </div>
      </div>
    </nav>
  );
}

// Root Layout component
export default function RootLayout({ children }) {


  return (
    <html lang="en" className={"dark"}>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
        <AuthProvider>
          <NavBar />
          <main className="pt-20 max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}