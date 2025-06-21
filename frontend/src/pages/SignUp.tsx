import { useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import {signUpUser} from '../api/authService';
import type { SignUpFormState, SignUpFormErrors } from '../types/authTypes';


type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof SignUpFormState; value: string }
  | { type: 'ADD_PROFESSION'; profession: string }
  | { type: 'REMOVE_PROFESSION'; index: number }
  | { type: 'RESET_FORM' };

const initialFormState: SignUpFormState = {
  name: '',
  profession: [],
  email: '',
  password: '',
  confirmPassword: ''
};

const formReducer = (state: SignUpFormState, action: FormAction): SignUpFormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'ADD_PROFESSION':
      return {
        ...state,
        profession: [...state.profession, action.profession]
      };
    case 'REMOVE_PROFESSION':
      return {
        ...state,
        profession: state.profession.filter((_, index) => index !== action.index)
      };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};

const SignUp = () => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [professionInput, setProfessionInput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', field: name as keyof SignUpFormState, value });
    
    if (errors[name as keyof SignUpFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (apiError) {
      setApiError('');
    }
  };

  const handleAddProfession = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      e.preventDefault();
      const trimmedProfession = professionInput.trim();
      
      if (trimmedProfession && !formState.profession.includes(trimmedProfession)) {
        dispatch({ type: 'ADD_PROFESSION', profession: trimmedProfession });
        setProfessionInput('');
        
        // Clear profession error if it exists
        if (errors.profession) {
          setErrors(prev => ({
            ...prev,
            profession: undefined
          }));
        }
      }
    }
  };

  const handleRemoveProfession = (index: number) => {
    dispatch({ type: 'REMOVE_PROFESSION', index });
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = 'First name is required';
    }
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const { confirmPassword, ...signupData } = formState;
    const result = await signUpUser(signupData);

    if (result.success) {
      dispatch({ type: 'RESET_FORM' });
      setProfessionInput('');
      console.log('Account created successfully:', result.data);
    } else {
      setApiError(result.message || 'Failed to create account');
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                Professions
              </label>
              <div className="mt-1">
                <div className="flex gap-2">
                  <input
                    id="profession"
                    name="profession"
                    type="text"
                    value={professionInput}
                    onChange={(e) => setProfessionInput(e.target.value)}
                    onKeyDown={handleAddProfession}
                    className={`appearance-none block flex-1 px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.profession ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter a profession"
                  />
                  <button
                    type="button"
                    onClick={handleAddProfession}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                {errors.profession && (
                  <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
                )}
                
                {formState.profession.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formState.profession.map((prof, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                      >
                        {prof}
                        <button
                          type="button"
                          onClick={() => handleRemoveProfession(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formState.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;