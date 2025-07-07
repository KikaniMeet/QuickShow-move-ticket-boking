// server.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';

import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

// Routes and Controllersb
import bookingRoutes from '/routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import showRouter from './routes/showRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Stripe Webhook middleware (must come before express.json)
    app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

    // Other middlewares
    app.use(express.json()); // After /api/stripe
    app.use(cors());
    app.use(clerkMiddleware());

    // Health check route
    app.get('/', (req, res) => {
      res.send('🚀 Server is Live!');
    });

    // Inngest event handling
    app.use('/api/inngest', serve({ client: inngest, functions }));

    // API Routes
    app.use('/api/show', showRouter);
    app.use('/api/booking', bookingRoutes);
    app.use('/api/admin', adminRouter);
    app.use('/api/user', userRouter);

    // Start the server
    app.listen(PORT, 'lockalhost', () => {
      console.log(`✅ Server running at http://locklhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Run the server
startServer();