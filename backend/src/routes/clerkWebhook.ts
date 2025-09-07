import bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';
import { Webhook } from 'svix';
import { env } from '../config/env';
import User from '../models/User';

const router = Router();

router.post(
   '/webhooks',
   bodyParser.raw({ type: 'application/json' }),
   async (req: Request, res: Response): Promise<void> => {
      const clerkWebhookSecret = env.CLERK_WEBHOOK_SECRET;

      const svix_id = req.headers['svix-id'] as string;
      const svix_timestamp = req.headers['svix-timestamp'] as string;
      const svix_signature = req.headers['svix-signature'] as string;

      if (!svix_id || !svix_timestamp || !svix_signature) {
         res.status(400).json({ error: 'Missing svix headers' });
         return;
      }

      const wh = new Webhook(clerkWebhookSecret);
      let evt: any;

      try {
         evt = wh.verify(req.body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
         });
      } catch (err) {
         res.status(400).json({ error: 'Invalid signature' });
         return;
      }

      try {
         switch (evt.type) {
            case 'user.created':
               await User.create({
                  clerkId: evt.data.id,
                  email: evt.data.email_addresses[0].email_address,
                  name: evt.data.first_name + ' ' + evt.data.last_name,
               });
               break;
            case 'user.updated':
               await User.findOneAndUpdate(
                  { clerkId: evt.data.id },
                  {
                     $set: {
                        email: evt.data.email_addresses[0].email_address,
                        name: evt.data.first_name + ' ' + evt.data.last_name,
                     },
                  },
                  { upsert: true, new: true }
               );
               break;
            case 'user.deleted':
               await User.findOneAndDelete({ clerkId: evt.data.id });
               break;
         }
      } catch (err) {
         res.status(500).json({ error: (err as Error).message });
         return;
      }
   }
);

export default router;
