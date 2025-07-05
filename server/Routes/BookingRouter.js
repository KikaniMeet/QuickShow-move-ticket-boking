// routes/bookingRoutes.js

import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const BookingRouter = express.Router();

// @route   POST /api/booking/create
// @desc    Create a new booking
BookingRouter.post('/create', createBooking);

// @route   GET /api/booking/seats/:showId
// @desc    Get occupied seats for a show
BookingRouter.get('/seats/:showId', getOccupiedSeats);

export default BookingRouter;
