// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ApiResponse } from '../types';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        aud: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Also check for token in cookies as backup
    const cookieToken = req.cookies?.accesstoken;
    
    const tokenToUse = token || cookieToken;

    if (!tokenToUse) {
      const response: ApiResponse = {
        success: false,
        message: 'Access token required',
        error: 'MISSING_TOKEN'
      };
      return res.status(401).json(response);
    }
    console.log(tokenToUse,'tokenToUse')
    // Get user from Supabase using the token
    const { data: { user }, error } = await supabase.auth.getUser(tokenToUse);

    if (error || !user) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid or expired token',
        error: 'INVALID_TOKEN'
      };
      return res.status(401).json(response);
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email!,
      aud: user.aud,
      role: user.role || 'authenticated'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed',
      error: 'AUTH_ERROR'
    };
    return res.status(401).json(response);
  }
};