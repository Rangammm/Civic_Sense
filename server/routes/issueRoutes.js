import express from 'express';
import { 
  getIssues, 
  createIssue, 
  getIssueById, 
  updateIssue, 
  deleteIssue, 
  upvoteIssue,
  getMyIssues
} from '../controllers/issueController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getIssues)
  .post(protect, upload.array('photos', 3), createIssue);

router.route('/my')
  .get(protect, getMyIssues);

router.route('/:id')
  .get(getIssueById)
  .put(protect, admin, updateIssue)
  .delete(protect, admin, deleteIssue);

router.route('/:id/upvote')
  .post(protect, upvoteIssue);

export default router;
