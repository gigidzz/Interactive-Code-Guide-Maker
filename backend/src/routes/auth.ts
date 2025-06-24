import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authServices';
import { validateRequest } from '../middleware';
import { SignupRequest, ConfirmRequest, ApiResponse } from '../types';

const router = Router();


/**
 * POST /api/auth/signup
 * Handle user signup with extra data
 */
router.post('/signup',
  validateRequest,
  async (req: Request<{}, ApiResponse, SignupRequest>, res: Response<ApiResponse>) => {
    try {
      console.log('shemovida')
      const { email, password, name, profession, bio } = req.body;
      console.log('shemovida', email, name, profession, bio)

      const extraData = {name, profession, bio}


      const tempId = await AuthService.storeTempSignupData(email, extraData);
      
      await AuthService.sendMagicLink(email, password);

      const response: ApiResponse = {
        success: true,
        message: 'Magic link sent successfully! Please check your email.',
        data: { tempId }
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error('Signup error:', error);
      
      const response: ApiResponse = {
        success: false,
        message: 'Failed to process signup',
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      return res.status(500).json(response);
    }
  }
);

/**
 * GET /api/auth/confirm
 * Handle magic link confirmation
 */
router.get('/confirm',
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { token_hash, type } = req.query as unknown as ConfirmRequest;

      console.log(token_hash, 'token')

      const authData = await AuthService.verifyMagicLink(token_hash, type);
      
      if (!authData.user) {
        // Redirect to frontend with error
        return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=error&message=Invalid or expired magic link`);
      }

      const { user } = authData;

      const existingProfile = await AuthService.getUserProfile(user.id);
      
      if (existingProfile) {
        // User already exists - redirect to login success
        return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=success&message=Login successful&existing=true`);
      }

      const tempData = await AuthService.getTempSignupData(user.email!);
      
      if (!tempData) {
        // Redirect with error
        return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=error&message=Signup data not found. Please sign up again.`);
      }

      // Create new user profile
      const newUser = await AuthService.createUserProfile(
        user.id,
        user.email!,
        tempData.extra_data
      );

      // Cleanup temp data
      await AuthService.cleanupTempData(user.email!);

      // Redirect to success page
      return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=success&message=Account created successfully&new=true`);

    } catch (error) {
      console.error('Confirm error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/confirm?status=error&message=Failed to confirm account`);
    }
  }
);

export default router;
