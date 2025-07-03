import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import showRouter from './routes/showRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';


const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Middleware for Stripe Webhooks (must come before express.json)
    app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

    // Other middlewares
    app.use(express.json()); // Only after /api/stripe
    app.use(cors());
    app.use(clerkMiddleware());

    // Routes
    app.get('/', (req, res) => res.send('Server is Live!'));
    app.use('/api/inngest', serve({ client: inngest, functions }));
    app.use('/api/show', showRouter);
    app.use('/api/booking', bookingRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/user', userRouter);

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
