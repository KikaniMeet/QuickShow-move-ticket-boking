import express from 'express';
import { createBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// Corrected route path
bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats); // ✅ Fixed path

export default bookingRouter;
