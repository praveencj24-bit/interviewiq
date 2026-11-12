import { Router } from 'express';
import { addInterview, getInterview, addAnswer } from '../controllers/interviews.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/limit.js';
import { uploadResume, readResume } from '../middleware/upload.js';
import { checkInterviewInput, checkAnswer } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.post('/', aiLimiter, uploadResume, readResume, checkInterviewInput, addInterview);
router.get('/:id', getInterview);
router.post('/:id/answers', aiLimiter, checkAnswer, addAnswer);

export default router;
