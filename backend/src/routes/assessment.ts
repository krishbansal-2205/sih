import express from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { createAssessment, getMyAssessments } from '../controllers/assessment';
import { upload } from '../utils/multerConfig';
import { processAssessmentVideo } from '../controllers/assessment';


const router = express.Router();

router.post(
  '/:id/process-video',
  requireAuth,
  upload.single('video'), // 'video' is the form-data key
  processAssessmentVideo
);
router.post('/', requireAuth, createAssessment);
router.get('/', requireAuth, getMyAssessments);

export default router;