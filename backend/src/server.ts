import app from './app';
import { env } from './config/env';
import { connectMongo } from './db/mongoose';

async function start() {
   try {
      await connectMongo(env.MONGO_URI);
      app.listen(Number(env.PORT), '0.0.0.0', () => {
         console.log(`API listening on http://localhost:${env.PORT}`);
      });
   } catch (e) {
      console.error('Failed to start server:', e);
      process.exit(1);
   }
}

start();
