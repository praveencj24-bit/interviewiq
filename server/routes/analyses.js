import { Router } from 'express';
import { addAnalysis, getAnalysis } from '../controllers/analyses.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/limit.js';
import { uploadResume, readResume } from '../middleware/upload.js';
import { checkAnalysisInput } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.post('/', aiLimiter, uploadResume, readResume, checkAnalysisInput, addAnalysis);
router.get('/:id', getAnalysis);

export default router;
