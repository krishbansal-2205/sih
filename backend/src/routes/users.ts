import { Router, type Request, type Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { z } from 'zod';
import User from '../models/User';

const router = Router();

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

// Upsert the authed user (from Clerk) into our DB
router.post('/sync', requireAuth(), async (req: Request, res: Response) => {
  const { userId } = getAuth(req); // string | null
  if (!userId) return res.status(401).end();

  const { email, name } = bodySchema.parse(req.body);

  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    { $set: { email, name } },
    { upsert: true, new: true }
  );

  res.json(user);
});

export default router;