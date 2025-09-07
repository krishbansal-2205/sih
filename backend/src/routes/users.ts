import { getAuth, requireAuth } from '@clerk/express';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import User from '../models/User';

const router = Router();

const bodySchema = z.object({
   email: z.email(),
   name: z.string().optional(),
});

// Upsert the authed user (from Clerk) into our DB
router.post(
   '/sync',
   requireAuth(),
   async (req: Request, res: Response): Promise<void> => {
      try {
         const { userId } = getAuth(req); // string | null
         if (!userId) res.status(401).end();

         const { email, name } = bodySchema.parse(req.body);

         const user = await User.findOneAndUpdate(
            { clerkId: userId },
            { $set: { email, name } },
            { upsert: true, new: true }
         );

         res.json(user);
      } catch (error) {
         res.status(400).json({ error: (error as Error).message });
      }
   }
);

export default router;
