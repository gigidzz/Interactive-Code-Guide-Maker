import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authService';
import { useUser } from '../context/userContext';
import type { LoginFormState, LoginFormErrors } from '../types/authTypes';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { refetchUser } = useUser();
  
  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const updateField = (field: keyof LoginFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const result = await loginUser(formData);

      if (result.success) {
        console.log('Login successful:', result.data);
        
        // Reset form
        setFormData({ email: '', password: '' });
        
        // Set token if provided
        if (result.data.token) {
          document.cookie = `accesstoken=${result.data.token}; path=/; max-age=86400`;
        }
        
        // Small delay to ensure cookie is set, then refetch user and navigate
        setTimeout(async () => {
          const token = document.cookie.split('; ').find(row => row.startsWith('accesstoken='));
          console.log('Cookie after login:', token);
          
          await refetchUser();
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

  return {
    formData,
    errors,
    isLoading,
    apiError,
    updateField,
    handleSubmit
  };
};