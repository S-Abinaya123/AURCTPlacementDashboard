import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("✅ MongoDB database connected");
    }
    catch(e) {
        console.log("❌ MongoDB failed to connect");
        process.exit(1);
    }
}

export default connectDB;