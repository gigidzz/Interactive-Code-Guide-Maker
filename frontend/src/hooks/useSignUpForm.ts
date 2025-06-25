import { useState } from 'react';
import { signUpUser } from '../api/authService';
import type { SignUpFormState, SignUpFormErrors } from '../types/authTypes';

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormState>({
    name: '',
    profession: [],
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [professionInput, setProfessionInput] = useState('');

  const updateField = (field: keyof SignUpFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError('');
  };

  const addProfession = () => {
    const trimmed = professionInput.trim();
    if (trimmed && !formData.profession.includes(trimmed)) {
      setFormData(prev => ({ ...prev, profession: [...prev.profession, trimmed] }));
      setProfessionInput('');
      if (errors.profession) {
        setErrors(prev => ({ ...prev, profession: undefined }));
      }
    }
  };

  const removeProfession = (index: number) => {
    setFormData(prev => ({
      ...prev,
      profession: prev.profession.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'First name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    const { confirmPassword, ...signupData } = formData;
    const result = await signUpUser(signupData);

    if (result.success) {
      setFormData({
        name: '',
        profession: [],
        email: '',
        password: '',
        confirmPassword: ''
      });
      setProfessionInput('');
      console.log('Account created successfully:', result.data);
    } else {
      setApiError(result.message || 'Failed to create account');
    }

    setIsLoading(false);
  };

  return {
    formData,
    errors,
    isLoading,
    apiError,
    professionInput,
    setProfessionInput,
    updateField,
    addProfession,
    removeProfession,
    handleSubmit
  };
};