// routes/bookingRoutes.js

import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// @route   POST /api/booking/create
// @desc    Create a new booking
bookingRouter.post('/create', createBooking);

// @route   GET /api/booking/seats/:showId
// @desc    Get occupied seats for a show
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
