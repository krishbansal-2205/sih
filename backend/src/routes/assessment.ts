import { Router, type Request, type Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { z } from 'zod';
import Assessment from '../models/Assessment';

const router = Router();

const createSchema = z.object({
  testType: z.string().min(1),
  score: z.number().finite(),
});

router.post('/', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req); // string | null
  if (!userId) return res.status(401).end(); // satisfies TS

  const payload = createSchema.parse(req.body);
  const created = await Assessment.create({ clerkId: userId, ...payload });
  res.status(201).json(created);
});

router.get('/me', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).end();

  const items = await Assessment.find({ clerkId: userId }).sort({ createdAt: -1 });
  res.json(items);
});

export default router;