import mongoose from 'mongoose'
import { DB_NAME } from '@/constant'


const MongoBDURI = process.env.MONGODB_URI;
if (!MongoBDURI) {
    throw new Error("Please provide the mongoDB URI to the .env file");
}

interface CachedConnection {
    conn: typeof mongoose | null,  //final connected mongoose instance
    promise : Promise <typeof mongoose> | null //connection in progress
}


//use globle variable to cache to connection across the hot reloads in development

declare global {
    var mongoConnection : CachedConnection | undefined
}

//Initialize cache
const cached : CachedConnection = global.mongoConnection || {conn: null , promise: null}


if(!global.mongoConnection){
    global.mongoConnection = cached;
}

export default async function connectDB(): Promise<typeof mongoose> {
    //if already connection xa bany
    if(cached.conn){
        console.log("Using existing MongoDB connection ");
        return cached.conn;
    }
    //if we don't have a connection promise, create one

    if(!cached.promise){
        const opts= {
            //suggest by AI i don't know what this is & how it work
            bufferCommands :false , // it says--[Disable mongooes buffering to fail fast]
        }

        console.log("Creating new MongoDB connection...");
        cached.promise = mongoose
        .connect(`${MongoBDURI}/${DB_NAME}`, opts)
        .then((mongooseInstance) => {
            console.log(`MongoDB connected successfully`);
            return mongooseInstance;
        })


    }

    try{
        //wait for the connection to be finished
        cached.conn = await cached.promise
    }
    catch(e){
        //if connection fails, reset the promise so we can try again

        cached.promise = null;
        console.log("MongoDB connection error:", e)
        throw e
    }

    return cached.conn
}






// MongoDB connection helper using Mongoose with global caching to prevent
// multiple connections in development and serverless environments.
// It reads MONGODB_URI from environment variables, reuses existing connections,
// and safely handles connection creation, reuse, and retry on failure.


// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${MongoBDURI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected: ${connectionInstance.connection.host}`);
//     }
//     catch (error) {
//         console.error("MongoBD connection FAILED :", error);
//         process.exit(1);
//     }
// }

// export default connectDB



//or 
//import mongoose from 'mongoose'
// import { DB_NAME } from '@/constant'

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//     throw new Error("Please define MONGODB_URI in your .env file");
// }

// interface CachedConnection {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
// }

// declare global {
//     var mongoose: CachedConnection | undefined;
// }

// const cached: CachedConnection = global.mongoose || { conn: null, promise: null };

// if (!global.mongoose) {
//     global.mongoose = cached;
// }

// export default async function connectDB(): Promise<typeof mongoose> {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: false, // Fail fast if not connected
//             dbName: DB_NAME,
//         };

//         cached.promise = mongoose.connect(MONGODB_URI, opts);
//     }

//     try {
//         cached.conn = await cached.promise;
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         cached.promise = null;
//         console.error("MongoDB connection error:", error);
//         throw error;
//     }

//     return cached.conn;
// }