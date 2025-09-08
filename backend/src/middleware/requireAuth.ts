import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
   const { userId } = getAuth(req);
   if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
   }
   // Attach userId to request for use in controllers
   (req as any).userId = userId;
   next();
}