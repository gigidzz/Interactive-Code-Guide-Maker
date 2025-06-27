import React from 'react';
import { FormInput } from '../components/formInputComponents';
import { ProfessionInput } from '../components/sign-up/professionInput';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { AuthContainer, AuthCard } from '../components/authContainer';
import { AuthHeader } from '../components/authHeader';

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
    <AuthContainer>
      <AuthHeader
        title="Create your account"
        subtitle="Or"
        linkText="sign in to your existing account"
        linkTo="/login"
      />
      
      <AuthCard>
        <form className="space-y-6" onSubmit={handleSubmit}>
            {apiError && (
              <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4">
                <p className="text-sm text-red-300">{apiError}</p>
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-purple-600/25"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
      </AuthCard>
    </AuthContainer>
  );
};

export default SignUp;