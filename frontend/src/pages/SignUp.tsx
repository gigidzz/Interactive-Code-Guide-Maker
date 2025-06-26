import React from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/formInputComponents';
import { ProfessionInput } from '../components/sign-up/professionInput';
import { useSignUpForm } from '../hooks/useSignUpForm';

const SignUp: React.FC = () => {
  const {
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
  } = useSignUpForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name as keyof typeof formData, e.target.value);
  };

  const handleProfessionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addProfession();
    }
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

            <FormInput
              id="name"
              name="name"
              type="text"
              label="First name"
              value={formData.name}
              placeholder="First name"
              error={errors.name}
              required
              onChange={handleInputChange}
            />

            <ProfessionInput
              professions={formData.profession}
              professionInput={professionInput}
              error={errors.profession}
              onInputChange={setProfessionInput}
              onAdd={addProfession}
              onRemove={removeProfession}
              onKeyDown={handleProfessionKeyDown}
            />

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
              onChange={handleInputChange}
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              placeholder="Create a password"
              error={errors.password}
              required
              autoComplete="new-password"
              onChange={handleInputChange}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              value={formData.confirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
              onChange={handleInputChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;