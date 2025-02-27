import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import { toast } from 'react-toastify';
import { getCart } from '../redux/actions/cartActions';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Fetch cart when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products-page?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setDropdownOpen(false);
      toast.success('Logged out successfully');
      // Refresh the page after a short delay to ensure toast is visible
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Calculate cart items count
  const cartItemsCount = items?.length || 0;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800" aria-label="ShopX Home">
          ShopX
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          <Link
            to="/"
            className={`text-gray-600 hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/products-page"
            className={`text-gray-600 hover:text-blue-600 ${location.pathname === '/products-page' ? 'text-blue-600' : ''}`}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`text-gray-600 hover:text-blue-600 ${location.pathname === '/about' ? 'text-blue-600' : ''}`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-gray-600 hover:text-blue-600 ${location.pathname === '/contact' ? 'text-blue-600' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Search, User Menu & Cart */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:block relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </form>

          {/* User Menu Dropdown */}
          <div ref={containerRef} className="relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="User menu"
            >
              {user?.avatar?.url ? (
                <img 
                  src={user.avatar.url} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                    
                    {user.role === "seller" ? (
                      <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/my-products"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Products
                      </Link>
                      </>
                    ) : (
                      <Link
                        to="/become-a-seller"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Become a Seller
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Shopping cart"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="21" r="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="21" r="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cartItemsCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                aria-label="Cart items"
              >
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}