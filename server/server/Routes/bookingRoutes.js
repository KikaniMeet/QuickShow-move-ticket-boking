// routes/bookingRoutes.js

import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';
 
const BookingRoutes= express.Router();

// @route   POST /api/booking/create
// @desc    Create a new booking
BookingRoutes.post('/create', createBooking);

// @route   GET /api/booking/seats/:showId
// @desc    Get occupied seats for a show
BookingRoutes.get('/seats/:showId', getOccupiedSeats);

export default BookingRoutes;
