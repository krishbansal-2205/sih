import { getAuth, requireAuth } from '@clerk/express';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import Assessment from '../models/Assessment';

const router = Router();

const createSchema = z.object({
   testType: z.string().min(1),
   score: z.number().finite(),
});

router.post(
   '/',
   requireAuth(),
   async (req: Request, res: Response): Promise<void> => {
      try {
         const { userId } = getAuth(req); // string | null
         if (!userId) res.status(401).end(); // satisfies TS

         const payload = createSchema.parse(req.body);
         const created = await Assessment.create({
            clerkId: userId,
            ...payload,
         });
         res.status(201).json(created);
      } catch (error) {
         res.status(400).json({ error: (error as Error).message });
      }
   }
);

router.get(
   '/me',
   requireAuth(),
   async (req: Request, res: Response): Promise<void> => {
      try {
         const { userId } = getAuth(req);
         if (!userId) res.status(401).end();

         const items = await Assessment.find({ clerkId: userId }).sort({
            createdAt: -1,
         });
         res.json(items);
      } catch (error) {
         res.status(400).json({ error: (error as Error).message });
      }
   }
);

export default router;
