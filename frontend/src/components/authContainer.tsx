import React from 'react';
import type { AuthContainerProps } from '../types/authTypes';

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => (
  <div className="bg-gray-50 flex flex-col justify-center py-3 sm:px-6 lg:px-8">
    {children}
  </div>
);

export const AuthCard: React.FC<AuthContainerProps> = ({ children }) => (
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {children}
    </div>
  </div>
);