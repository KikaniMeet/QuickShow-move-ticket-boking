import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.once('connected', () => {
      console.log('✅ MongoDB connected');
    });

    await mongoose.connect(`${process.env.MONGODB_URL}/quickshow`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error); // log full error
    process.exit(1);
  }
};


export default connectDB;
