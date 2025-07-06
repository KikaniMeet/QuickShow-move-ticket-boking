import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js" 
import BookingRouter from './routes/BookingRouter.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js'
import showRouter from './routes/showRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';


const app = express();
const Port = 3000;

(async () => {

    app.use('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks)

    await connectDB();  
    app.use(express.json());
    app.use(cors());
    app.use(clerkMiddleware())

    // Routes
    app.get('/', (req, res) => res.send('Server is Live!'));
    app.use('/api/inngest', serve({ client: inngest, functions }))  
    app.use('/api/show',showRouter)
    app.use('/api/booking',BookingRouter)
    app.use('/api/admin',adminRouter)
    app.use('/api/user',userRouter)




    // Start server
    app.listen(Port, () => console.log(`Server listening at http://localhost:${Port}`));
})();