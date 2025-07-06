// routes/bookingRoutes.js

import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const tempRouter = express.Router();

// @route   POST /api/booking/create
// @desc    Create a new booking
tempRouter.post('/create', createBooking);

// @route   GET /api/booking/seats/:showId
// @desc    Get occupied seats for a show
tempRouter.get('/seats/:showId', getOccupiedSeats);

export default tempRouter;
