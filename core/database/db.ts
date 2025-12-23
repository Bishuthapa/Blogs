import mongoose from 'mongoose'
import { DB_NAME } from '@/constant'



const MongoBDURI = process.env.MONGODB_URI;

if(!MongoBDURI){
    throw new Error("Please provide the mongoDB URI to the .env file");
}

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected: ${connectionInstance.connection.host}`);

    }
    catch (error) {
        console.error("MongoBD connection FAILED :", error);
        process.exit(1);
    }
} 

export default connectDB