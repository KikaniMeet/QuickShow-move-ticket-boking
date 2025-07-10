import express from "express";
import {
  getUserBookings,
  updateFavorite,
  getFavorites
} from "../controllers/userController.js";
// import { authenticateUser } from "../middleware/authenticate.js"; // ✅ Import the middleware

const userRouter = express.Router();

// ✅ Use middleware to ensure routes are protected
userRouter.get('/bookings',getUserBookings);
userRouter.post('/update-favorite',updateFavorite);
userRouter.get('/favorites',getFavorites);

export default userRouter;
