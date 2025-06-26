// components/Navbar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import UserCard from './UserCard';
import { removeCookie } from '../utils/cookies';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, refetchUser } = useUser();

  console.log(user, 'user')

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint if you have one
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from cookies
      removeCookie('accesstoken');
      // Refetch user to update state
      await refetchUser();
      // Redirect to home page
      navigate('/');
    }
  };

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                LUIGI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              LUIGI
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              // User is logged in - show user card and code guide button
              <>
                <Link
                  to="/code-guide"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/code-guide')
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'
                  }`}
                >
                  Code Guide
                </Link>
                <UserCard user={user} onLogout={handleLogout} />
              </>
            ) : (
              // User is not logged in - show login and signup buttons
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'
                  }`}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-600 transition-colors ${
                    isActive('/signup') ? 'bg-blue-600' : 'bg-gray-500'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;