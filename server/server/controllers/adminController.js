import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// Admin status check
export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

// ✅ Fixed getDashboardData with only valid shows
export const getDashboardData = async (req, res) => {
  try {
    // Step 1: Get all paid bookings
    const bookings = await Booking.find({ isPaid: true });

    // Step 2: Get all upcoming shows and populate movie
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    // Step 3: Filter shows with valid movie objects
    const activeShows = shows.filter(show => show.movie && show.movie._id);

    // Step 4: Get user count
    const totalUser = await User.countDocuments();

    // Step 5: Assemble dashboard data
    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser
    };

    // Step 6: Send result
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Dashboard Error →", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Existing controller code stays the same:

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user')
      .populate({
        path: "show",
        populate: { path: "movie" }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
