import express from 'express';
import { categorizeIssue, chatWithAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/categorize', protect, categorizeIssue);
router.post('/chat', protect, chatWithAssistant);

export default router;
