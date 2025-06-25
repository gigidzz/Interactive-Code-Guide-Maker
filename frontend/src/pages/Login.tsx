import { useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService';
import { useUser } from '../context/userContext'; // Updated import
import type { LoginFormErrors, LoginFormState } from '../types/authTypes';

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof LoginFormState; value: string | boolean }
  | { type: 'RESET_FORM' };

const initialFormState: LoginFormState = {
  email: '',
  password: ''
};

const formReducer = (state: LoginFormState, action: FormAction): LoginFormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};

const Login = () => {
  const navigate = useNavigate(); // Add this hook
  const { refetchUser } = useUser(); // Add this hook to refetch user data
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    dispatch({ type: 'UPDATE_FIELD', field: name as keyof LoginFormState, value: fieldValue });
    
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const result = await loginUser(formState);

      if (result.success) {
        console.log('Login successful:', result.data);
        dispatch({ type: 'RESET_FORM' });
        
        // If your backend returns the token in the response body, set it manually
        if (result.data.token) {
          document.cookie = `accesstoken=${result.data.token}; path=/; max-age=86400`;
        }
        
        // Add a small delay to ensure cookie is set
        setTimeout(async () => {
          // Check if cookie was set
          const token = document.cookie.split('; ').find(row => row.startsWith('accesstoken='));
          console.log('Cookie after login:', token);
          
          // Refetch user data to update the navbar
          await refetchUser();
          
          // Navigate to home page
          navigate('/', { replace: true });
        }, 100);
      } else {
        setApiError(result.message || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {apiError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>


            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;