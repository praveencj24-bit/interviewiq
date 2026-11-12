import { Router } from 'express';
import { getHistory } from '../controllers/history.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getHistory);

export default router;
