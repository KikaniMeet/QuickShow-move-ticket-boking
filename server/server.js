import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import bookingRouter from './routes/BookingRouter.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js'
import showRouter from './Routes/showRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';
import { env } from 'process';


const app = express();
const PORT = process.env.PORT || 3000;


(async () => {

  app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

  await connectDB();
  app.use(express.json());
  app.use(cors());
  app.use(clerkMiddleware())

  // Routes
  app.get('/', (req, res) => res.send('Server is Live!'));
  app.use('/api/inngest', serve({ client: inngest, functions }))
  app.use('/api/show', showRouter)
  app.use('/api/booking', bookingRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api/user', userRouter)




  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });

})();