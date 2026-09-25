import { Router } from 'express';
import { registerController, loginController, meController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginController);
authRouter.get('/me', requireAuth, meController);