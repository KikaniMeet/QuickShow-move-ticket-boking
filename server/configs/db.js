import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Optional: Add once to avoid multiple listeners
    mongoose.connection.once('connected', () => {
      console.log('✅ MongoDB connected');
    });

    await mongoose.connect(`${process.env.MONGODB_URL}/quickshow`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Optional: Exit on failure
  }
};

export default connectDB;
