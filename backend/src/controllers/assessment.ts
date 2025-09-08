import { Request, Response } from 'express';
import { z } from 'zod';
import Assessment from '../models/Assessment';
import axios from 'axios';

const createSchema = z.object({
   testType: z.string().min(1),
   score: z.number().finite(),
});

export const createAssessment = async (req: Request, res: Response): Promise<void> => {
   try {
      const userId = (req as any).userId;
      const payload = createSchema.parse(req.body);
      const created = await Assessment.create({
         clerkId: userId,
         ...payload,
      });
      res.status(201).json(created);
   } catch (error) {
      res.status(400).json({ error: (error as Error).message });
   }
};

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

export const processAssessmentVideo = async (req: Request, res: Response) => {
  try {
    const assessmentId = req.params.id;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded.' });
    }

    // Example: Send video buffer to ML service
    const mlResponse = await axios.post(
      'http://ml-service/assess', // Replace with your ML endpoint
      file.buffer,
      { headers: { 'Content-Type': file.mimetype } }
    );

    const { score, aiResults, cheatFlags } = mlResponse.data;

    const updated = await Assessment.findByIdAndUpdate(
      assessmentId,
      { score, aiResults, cheatFlags, status: 'verified' },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Assessment not found.' });
    }
    res.json({ message: 'Assessment processed successfully.', assessment: updated });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};