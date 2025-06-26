import { Router } from 'express';
import { CodeGuideController } from '../controllers/codeGuideController';
import { authenticateToken } from '../middleware/auth';
import { validateGuide, validateStep } from '../middleware/validation';

const router = Router();

router.get('/guides', CodeGuideController.getGuides);
router.get('/guides/:id', CodeGuideController.getGuideById);
router.post('/guides', authenticateToken, validateGuide, CodeGuideController.createGuide);
router.put('/guides/:id', authenticateToken, validateGuide, CodeGuideController.updateGuide);
router.delete('/guides/:id', authenticateToken, CodeGuideController.deleteGuide);

router.get('/guides/:guideId/steps', CodeGuideController.getStepsByGuideId);
router.post('/steps', authenticateToken, validateStep, CodeGuideController.createStep);
router.put('/steps/:id', authenticateToken, validateStep, CodeGuideController.updateStep);
router.delete('/steps/:id', authenticateToken, CodeGuideController.deleteStep);

export default router;