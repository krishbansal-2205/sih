import { Request, Response } from 'express';
import { z } from 'zod';
import Assessment from '../models/Assessment';
import axios from 'axios';

const createSchema = z.object({
   testType: z.string().min(1),
   score: z.number().finite(),
});

/**
 * Create assessment OR update if retaken with a better score
 */
export const createAssessment = async (req: Request, res: Response): Promise<void> => {
   try {
      const userId = (req as any).userId;
      const payload = createSchema.parse(req.body);

      // Check if assessment already exists for this user and testType
      const existing = await Assessment.findOne({
        clerkId: userId,
        testType: payload.testType,
      });

      let result;
      if (existing) {
        // If retake → update score only if new score is higher
        if (payload.score > existing.score) {
          existing.score = payload.score;
          existing.status = 'verified';
          existing.updatedAt = new Date();
          result = await existing.save();
        } else {
          result = existing; // keep the higher (previous) score
        }
      } else {
        result = await Assessment.create({
          clerkId: userId,
          ...payload,
          status: 'verified',
        });
      }

      res.status(201).json(result);
   } catch (error) {
      res.status(400).json({ error: (error as Error).message });
   }
};

/**
 * Get all assessments of the logged-in user
 */
export const getMyAssessments = async (req: Request, res: Response): Promise<void> => {
   try {
      const userId = (req as any).userId;
      const items = await Assessment.find({ clerkId: userId }).sort({
         createdAt: -1,
      });
      res.json(items);
   } catch (error) {
      res.status(400).json({ error: (error as Error).message });
   }
};

/**
 * Process assessment video with ML and update best score
 */
export const processAssessmentVideo = async (req: Request, res: Response) => {
  try {
    const assessmentId = req.params.id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded.' });
    }

    // Example: Send video buffer to ML service
    const mlResponse = await axios.post(
      'Replace with your ML endpoint',  
      file.buffer,
      { headers: { 'Content-Type': file.mimetype } }
    );

    const { score, aiResults, cheatFlags, testType } = mlResponse.data;

    // Fetch current assessment
    const current = await Assessment.findById(assessmentId);
    if (!current) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }

    // If retake → update only if score is higher
    if (!current.score || score > current.score) {
      current.score = score;
      current.aiResults = aiResults;
      current.cheatFlags = cheatFlags;
      current.status = 'verified';
      await current.save();
    }

    res.json({
      message: 'Assessment processed successfully.',
      assessment: current,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Fetch leaderboard by test type
 */
export const getLeaderboardByTestType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { testType } = req.params;
    if (!testType) {
      res.status(400).json({ error: 'Test type is required.' });
      return;
    }

    const leaderboard = await Assessment.find({ testType, status: 'verified' })
      .sort({ score: -1 })
      .limit(20);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Delete assessment
 */
export const deleteAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const assessmentId = req.params.id;

    const deleted = await Assessment.findOneAndDelete({
      _id: assessmentId,
      clerkId: userId,
    });

    if (!deleted) {
      res.status(404).json({ error: 'Assessment not found or not authorized.' });
      return;
    }

    res.json({ message: 'Assessment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Get flagged assessments (for admin)
 */
export const getFlaggedAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const flagged = await Assessment.find({ cheatFlags: { $exists: true, $ne: [] } })
      .sort({ createdAt: -1 });

    res.json(flagged);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
