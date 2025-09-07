import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
   NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
   PORT: z.string().default('5000'),
   MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
   CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
   CLERK_PUBLISHABLE_KEY: z
      .string()
      .min(1, 'CLERK_PUBLISHABLE_KEY is required'),
   CLERK_WEBHOOK_SECRET: z.string().min(1, 'CLERK_WEBHOOK_SECRET is required'),
   CORS_ORIGIN: z.string().optional(), // comma-separated list for dev
});

export const env = envSchema.parse(process.env);
