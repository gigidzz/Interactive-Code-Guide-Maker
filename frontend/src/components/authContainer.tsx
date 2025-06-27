import React from 'react';
import type { AuthContainerProps } from '../types/authTypes';

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => (
  <div className="bg-slate-900 flex flex-col py-3 sm:px-6 lg:px-8 min-h-screen">
    {children}
  </div>
);

export const AuthCard: React.FC<AuthContainerProps> = ({ children }) => (
  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-slate-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-purple-500/20">
      {children}
    </div>
  </div>
);