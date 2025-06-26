import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/signup', validateSignup, AuthController.signup);
router.post('/login', validateLogin, AuthController.login);
router.get('/confirm', AuthController.confirm);
router.get('/user/me', authenticateToken, AuthController.getProfile);

export default router;