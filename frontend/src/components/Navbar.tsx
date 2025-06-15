import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;