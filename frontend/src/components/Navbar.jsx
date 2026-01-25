import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, User, LogOut } from 'lucide-react';
import { authService } from '@/services/authService';


const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = async () => {
    try {
    await authService.logout();
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    navigate('/login', { replace: true });
  }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black border-b border-[#363636] z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-white">
            SocialSnap
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              data-testid="nav-home"
              className={`hover:text-gray-300 transition-colors ${
                isActive('/') ? 'text-white' : 'text-gray-400'
              }`}
            >
              <Home size={24} />
            </Link>
            
            <Link
              to="/search"
              data-testid="nav-search"
              className={`hover:text-gray-300 transition-colors ${
                isActive('/search') ? 'text-white' : 'text-gray-400'
              }`}
            >
              <Search size={24} />
            </Link>

            <Link
              to="/profile"
              data-testid="nav-profile"
              className={`hover:text-gray-300 transition-colors ${
                isActive('/profile') ? 'text-white' : 'text-gray-400'
              }`}
            >
              <User size={24} />
            </Link>

            <button
              onClick={handleLogout}
              data-testid="nav-logout"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
