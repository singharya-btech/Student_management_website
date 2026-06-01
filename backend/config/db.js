import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Get MongoDB URI from .env
    const uri = process.env.MONGO_URI;

    // Check if URI exists
    if (!uri) {
      throw new Error('MONGO_URI is missing in .env file');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;