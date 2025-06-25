// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCookie, removeCookie } from '../utils/cookies';

export interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get token from cookies
      const access_token = getCookie('accesstoken');
      console.log('Token from cookie:', access_token);
      
      if (!access_token) {
        console.log('No access token found');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('Fetching user data...');

      const response = await fetch('http://localhost:5000/api/auth/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData.data);
      } else if (response.status === 401) {
        console.log('Token is invalid or expired');
        setUser(null);
        removeCookie('accesstoken');
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch user data:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
    } catch (err) {
      console.error('Error in fetchUser:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = async () => {
    console.log('Refetching user...');
    await fetchUser();
  };

  useEffect(() => {
    console.log('UserProvider mounted, fetching user...');
    fetchUser();
  }, []);

  const value = {
    user,
    isLoading,
    error,
    refetchUser,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

