import React from 'react';
import { Link } from 'react-router-dom';
import type { AuthHeaderProps } from '../types/authTypes';

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  linkText,
  linkTo
}) => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {title}
    </h2>
    <p className="mt-2 text-center text-sm text-gray-600">
      {subtitle}{' '}
      <Link
        to={linkTo}
        className="font-medium text-blue-600 hover:text-blue-500"
      >
        {linkText}
      </Link>
    </p>
  </div>
);