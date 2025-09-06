import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import assessmentsRouter from './routes/assessment';
import clerkWebhookRouter from './routes/clerkWebhook';
import usersRouter from './routes/users';

const app: Application = express();

// Trust proxy if behind reverse proxy (Railway/Render/etc.)
app.set('trust proxy', 1);

app.use(helmet());
app.use(
   cors({
      origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : true,
      credentials: true,
   })
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Attach Clerk (decodes Authorization header if present)
app.use(clerkMiddleware());

// Rate limiter (tune to your needs)
app.use(
   rateLimit({
      windowMs: 60 * 1000,
      max: 120,
   })
);

// Health check
app.get('/health', (_req, res): void => {
   res.json({ message: 'OK' });
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api', clerkWebhookRouter);

// 404
app.use((req, res): void => {
   res.status(404).json({ message: 'Not found' });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(
   (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
   ) => {
      console.error(err);
      res.status(err.status || 500).json({
         message: err.message || 'Server error',
      });
   }
);

export default app;
