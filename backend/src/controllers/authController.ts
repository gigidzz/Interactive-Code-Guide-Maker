import { Request, Response } from 'express';
import { AuthService } from '../services/authServices';
import { ApiResponse, SignupRequest, LoginRequest } from '../types';

export class AuthController {
  static async signup(req: Request<{}, ApiResponse, SignupRequest>, res: Response<ApiResponse>) {
    try {
      const { email, password, name, profession, bio } = req.body;
      
      const tempId = await AuthService.storeTempSignupData(email, { name, profession, bio });
      await AuthService.sendMagicLink(email, password);

      return res.status(200).json({
        success: true,
        message: 'Magic link sent successfully! Please check your email.',
        data: { tempId }
      });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process signup',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async login(req: Request<{}, ApiResponse, LoginRequest>, res: Response<ApiResponse>) {
    try {
      const { email, password } = req.body;
      
      const existingUser = await AuthService.getUserByEmail(email);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address. Please sign up first.',
          error: 'User not found'
        });
      }

      const accessToken = await AuthService.loginSupabase(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { access_token: accessToken }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to process login',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static async confirm(req: Request, res: Response) {
    try {
      const { token_hash, type } = req.query;
      const frontendUrl = process.env.FRONTEND_URL;

      const authData = await AuthService.verifyMagicLink(token_hash as string, type as string);
      
      if (!authData.user) {
        return res.redirect(`${frontendUrl}/confirm?status=error&message=Invalid or expired magic link`);
      }

      const { user } = authData;
      const existingProfile = await AuthService.getUserProfile(user.id);
      
      if (existingProfile) {
        return res.redirect(`${frontendUrl}/confirm?access_token=${authData.session!.access_token}&status=success&message=Login successful&existing=true`);
      }

      const tempData = await AuthService.getTempSignupData(user.email!);
      if (!tempData) {
        return res.redirect(`${frontendUrl}/confirm?status=error&message=Signup data not found. Please sign up again.`);
      }

      await AuthService.createUserProfile(user.id, user.email!, tempData.extra_data);
      await AuthService.cleanupTempData(user.email!);

      return res.redirect(`${frontendUrl}/confirm?access_token=${authData.session!.access_token}&status=success&message=Account created successfully&new=true`);
    } catch (error) {
      console.error('Confirm error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=error&message=Failed to confirm account`);
    }
  }

  static async getProfile(req: Request, res: Response<ApiResponse>) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const userProfile = await AuthService.getUserByAuthId(req.user.id);
      if (!userProfile) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found',
          error: 'PROFILE_NOT_FOUND'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          profession: userProfile.profession,
          bio: userProfile.bio,
          profile_picture: userProfile.profile_picture
        }
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}