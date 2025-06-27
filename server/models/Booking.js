import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show", // Reference to Show model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: [String], // array of seat IDs or seat numbers
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
