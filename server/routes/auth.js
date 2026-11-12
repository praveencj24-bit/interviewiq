import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { checkRegister, checkLogin } from '../middleware/validate.js';

const router = Router();

router.post('/register', checkRegister, register);
router.post('/login', checkLogin, login);
router.get('/me', requireAuth, getMe);

export default router;
