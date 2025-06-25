import React, { useEffect, useState } from 'react';

const ConfirmSignup: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    // Remove secure flag if not on HTTPS, and add domain for broader accessibility
    const isSecure = window.location.protocol === 'https:';
    const cookieString = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/${isSecure ? ';secure' : ''};samesite=lax`;
    
    document.cookie = cookieString;
    console.log('Setting cookie:', cookieString);
    
    // Verify the cookie was set
    const cookieValue = getCookie(name);
    console.log('Cookie verification - set value:', value, 'retrieved value:', cookieValue);
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlStatus = urlParams.get('status');
    const urlMessage = urlParams.get('message');
    const isExisting = urlParams.get('existing');
    const isNew = urlParams.get('new');
    const access_token = urlParams.get('access_token');

    console.log('Token hash from URL:', access_token);
    console.log('Current protocol:', window.location.protocol);
    console.log('Current domain:', window.location.hostname);

    if (access_token) {
      setCookie('accesstoken', access_token, 30);
      console.log('Token hash saved to cookies:', access_token);
      
      // Additional verification
      setTimeout(() => {
        const savedToken = getCookie('accesstoken');
        console.log('Token verification after timeout:', savedToken);
      }, 100);
    }

    if (urlStatus && urlMessage) {
      setStatus(urlStatus as 'success' | 'error');
      setMessage(decodeURIComponent(urlMessage));

      if (urlStatus === 'success') {
        // setTimeout(() => {
        //   if (isExisting) {
        //     window.location.href = '/';
        //   } else if (isNew) {
        //     window.location.href = '/';
        //   } else {
        //     window.location.href = '/login';
        //   }
        // }, 2000);
      }
    } else {
      setStatus('error');
      setMessage('Invalid confirmation link');
    }
  }, []);

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
              <p className="text-gray-600">Processing confirmation...</p>
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
              <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
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
                onClick={() => window.location.href = '/signup'}
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