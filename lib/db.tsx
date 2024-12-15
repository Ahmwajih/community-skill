import mongoose from 'mongoose';
import User from '@/models/User'; 
import Skill from '@/models/Skill'; 

const db = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
    
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
 
export default db;
