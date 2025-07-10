import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Stripe from 'stripe';

// ✅ Seat availability checker
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log("Seat Availability Error:", error.message);
    return false;
  }
};

// ✅ Create Booking Endpoint
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk Auth (middleware)
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!userId || !showId || !Array.isArray(selectedSeats) || !selectedSeats.length) {
      return res.status(400).json({ success: false, message: "Invalid booking input." });
    }

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "❌ Selected Seats are not available." });
    }

    const showData = await Show.findById(showId).populate('movie');
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found." });
    }

    const amount = showData.showPrice * selectedSeats.length;

    // 🧾 Create booking in DB first
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount,
      bookingSeats: selectedSeats,
    });

    // 🪑 Mark seats as booked
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });
    showData.markModified('occupiedSeats');
    await showData.save();

    // 💳 Stripe Checkout
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: showData.movie.title,
            },
            unit_amount: Math.floor(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    booking.paymentLink = session.url;
    await booking.save(); // 🛠️ Fix typo (was `.seve()`)

    res.json({ success: true, url: session.url, booking });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Occupied Seats
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found." });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("Get Occupied Seats Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
