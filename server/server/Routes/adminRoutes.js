import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import {
  getAllBookings,
  getAllShows,
  getDashboardData,
  isAdmin
} from "../controllers/adminController.js";
import { addShow } from "../controllers/showController.js"; // ✅ Add this

const adminRouter = express.Router();

adminRouter.get('/is-admin', protectAdmin, isAdmin);
adminRouter.get('/dashboard', protectAdmin, getDashboardData);
adminRouter.get('/all-shows', protectAdmin, getAllShows);
adminRouter.get('/all-bookings', protectAdmin, getAllBookings);
adminRouter.post('/show/add', protectAdmin, addShow); // ✅ Add this route

export default adminRouter;
