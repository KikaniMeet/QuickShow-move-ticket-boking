import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js" 

const app = express();
const Port = 3000;

(async () => {
    await connectDB();  

    app.use(express.json());
    app.use(cors());
    app.use(clerkMiddleware())

    // Routes
    app.get('/', (req, res) => res.send('Server is Live!'));
    app.use('/api/inngest', serve({ client: inngest, functions }))  

    // Start server
    app.listen(Port, () => console.log(`Server listening at http://localhost:${Port}`));
})();
