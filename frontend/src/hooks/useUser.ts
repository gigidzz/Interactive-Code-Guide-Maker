// hooks/useUser.ts
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get token from cookies
      const access_token = getCookie('accesstoken'); // You'll need to implement getCookie
      console.log('kokokokok', access_token)
      
      if (!access_token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('lolipopa')

      const response = await fetch('http://localhost:5000/api/auth/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, // or however your backend expects the token
        },
        credentials: 'include', // Include cookies in the request
      });



      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data);
      } else if (response.status === 401) {
        // Token is invalid or expired
        setUser(null);
        // Optionally remove the invalid token from cookies
        // removeCookie('accesstoken');
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, error, refetchUser };
};

// Utility functions for cookie management
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};