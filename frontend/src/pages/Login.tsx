import React from 'react';
import { AuthContainer, AuthCard } from '../components/authContainer';
import { AuthHeader } from '../components/authHeader';
import { LoginForm } from '../components/login/loginForm';
import { useLoginForm } from '../hooks/useLogInForm';

const Login: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    apiError,
    updateField,
    handleSubmit
  } = useLoginForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name as keyof typeof formData, e.target.value);
  };

  return (
    <AuthContainer>
      <AuthHeader
        title="Sign in to your account"
        subtitle="Or"
        linkText="create a new account"
        linkTo="/signup"
      />
      
      <AuthCard>
        <LoginForm
          onSubmit={handleSubmit}
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          apiError={apiError}
          onInputChange={handleInputChange}
        />
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;