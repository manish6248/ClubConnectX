import mongoose from 'mongoose';

//connect .env 
import dotenv from 'dotenv';
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;