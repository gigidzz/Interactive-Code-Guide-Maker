import { Router } from 'express';
import { CodeGuideController } from '../controllers/codeGuideController';
import { authenticateToken } from '../middleware/auth';
import { validateGuideWithSteps, validateStep } from '../middleware/validation';

const router = Router();

router.get('/guides', CodeGuideController.getGuides);
router.get('/guides/:id', CodeGuideController.getGuideById);
router.get('/guides/author/:id', CodeGuideController.getGuideByAuthorId);
router.get('/my-guides', authenticateToken, CodeGuideController.getMyGuides);
router.post('/guides', authenticateToken, validateGuideWithSteps, CodeGuideController.createGuide);
router.put('/guides/:id', authenticateToken, validateGuideWithSteps, CodeGuideController.updateGuide);
router.delete('/guides/:id', authenticateToken, CodeGuideController.deleteGuide);

router.get('/guides/:guideId/steps', CodeGuideController.getStepsByGuideId);
router.post('/steps', authenticateToken, validateStep, CodeGuideController.createStep);
router.put('/steps/:id', authenticateToken, validateStep, CodeGuideController.updateStep);
router.delete('/steps/:id', authenticateToken, CodeGuideController.deleteStep);

export default router;