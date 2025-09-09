import express from 'express';
import { requireAuth } from '../middleware/requireAuth';
import {
  createAssessment,
  getMyAssessments,
  processAssessmentVideo,
  getLeaderboardByTestType,
  deleteAssessment,
  getFlaggedAssessments,
} from '../controllers/assessment';
import { upload } from '../utils/multerConfig';

const router = express.Router();

// Process uploaded video for an assessment
router.post(
  '/:id/process-video',
  requireAuth,
  upload.single('video'), // 'video' is the form-data key
  processAssessmentVideo
);

// Create new assessment
router.post('/', requireAuth, createAssessment);

// Get all assessments of logged-in user
router.get('/', requireAuth, getMyAssessments);

// Get leaderboard by test type (public/athletes)
router.get('/leaderboard/:testType', requireAuth, getLeaderboardByTestType);

// // Delete assessment (only owner can delete)
// router.delete('/:id', requireAuth, deleteAssessment);

// // Get all flagged assessments (admin-only — needs role check inside controller or middleware)
// router.get('/flagged/all', requireAuth, getFlaggedAssessments);

export default router;
