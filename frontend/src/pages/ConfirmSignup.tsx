import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ConfirmSignup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmSignup = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || !type) {
          setStatus('error');
          setMessage('Missing confirmation parameters');
          return;
        }

        document.cookie = `token_hash=${tokenHash}; path=/; max-age=3600; secure; samesite=strict`;
        document.cookie = `confirmation_type=${type}; path=/; max-age=3600; secure; samesite=strict`;

        const storedName = localStorage.getItem('signup_name');
        const storedProfessions = localStorage.getItem('signup_professions');

        if (!storedName || !storedProfessions) {
          setStatus('error');
          setMessage('Signup data not found. Please sign up again.');
          return;
        }

        let professionsArray;
        try {
          professionsArray = JSON.parse(storedProfessions);
        } catch (error) {
          setStatus('error');
          setMessage('Invalid professions data');
          return;
        }

        const confirmationData = {
          token_hash: tokenHash,
          type: type,
          name: storedName,
          professions: professionsArray
        };

        const response = await fetch('/api/confirm-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(confirmationData),
          credentials: 'include'
        });

        if (response.ok) {
          const result = await response.json();
          setStatus('success');
          setMessage('Email confirmed successfully! You can now log in.');
          
          localStorage.removeItem('signup_name');
          localStorage.removeItem('signup_professions');
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Confirmation failed');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage('Network error occurred during confirmation');
      }
    };

    confirmSignup();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Confirmation
          </h2>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Confirming your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to login page...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="text-red-600 font-medium">{message}</p>
              <button
                onClick={() => navigate('/signup')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Back to Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignup;