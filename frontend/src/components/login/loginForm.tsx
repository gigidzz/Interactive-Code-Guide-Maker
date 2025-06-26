import React from 'react';
import { FormInput } from '../formInputComponents';
import type { LoginFormProps } from '../../types/authTypes';

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  formData,
  errors,
  isLoading,
  apiError,
  onInputChange
}) => (
  <form className="space-y-6" onSubmit={onSubmit}>
    {apiError && (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{apiError}</p>
      </div>
    )}

    <FormInput
      id="email"
      name="email"
      type="email"
      label="Email address"
      value={formData.email}
      placeholder="Enter your email"
      error={errors.email}
      required
      autoComplete="email"
      onChange={onInputChange}
    />

    <FormInput
      id="password"
      name="password"
      type="password"
      label="Password"
      value={formData.password}
      placeholder="Enter your password"
      error={errors.password}
      required
      autoComplete="current-password"
      onChange={onInputChange}
    />

    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Signing in...' : 'Sign in'}
    </button>
  </form>
);