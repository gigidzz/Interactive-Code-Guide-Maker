import type { ApiResponse } from "../types";
import type { LoginData, SignUpData } from "../types/authTypes";

export const signUpUser = async (userData: SignUpData): Promise<ApiResponse> => {
  console.log(userData, 'userdata')
  
  try {
    const { email, password, name, profession } = userData;
    
    
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, profession, bio: 'kokori' }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Clean up localStorage if signup fails
      localStorage.removeItem('pendingUserData');
      throw new Error(data.message || 'Signup failed');
    }

    return {
      success: true,
      message: 'check email for magic link',
      data,
    };
  } catch (error) {
    // Clean up localStorage on error
    localStorage.removeItem('pendingUserData');
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};

export const loginUser = async (userData: LoginData): Promise<ApiResponse> => {
  console.log(userData, 'userdata')
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
};