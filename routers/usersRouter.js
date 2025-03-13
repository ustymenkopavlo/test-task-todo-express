import express from 'express';
import {
  getUserById,
  login,
  refresh,
  register,
} from '../controllers/usersController.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../joi-schemas/userSchemas.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateObjectIds } from '../middlewares/validateObjectIds.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), register);
router.post('/login', validateBody(loginUserSchema), login);
router.post('/refresh', refresh);
router.get('/:id', auth, validateObjectIds('id'), getUserById);

export default router;
