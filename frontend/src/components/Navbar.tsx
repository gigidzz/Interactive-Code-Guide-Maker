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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeCookie('accesstoken');
      await refetchUser();
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <nav className="bg-slate-900 shadow-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-400">
                LUIGI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 shadow-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
              LUIGI
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/code-guide"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/code-guide')
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Code Guide
                </Link>
                <UserCard user={user} onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/login')
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                    isActive('/signup') 
                      ? 'bg-purple-700 shadow-lg shadow-purple-700/25' 
                      : 'bg-gray-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/30'
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