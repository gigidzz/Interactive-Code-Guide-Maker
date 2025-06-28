import { Router } from 'express';
import { UsersController } from '../controllers/usersController';

const router = Router();

router.get('/', UsersController.getUsers);
router.get('/:id', UsersController.getUserById);

export default router;