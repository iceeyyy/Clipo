import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if(!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env.local");
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {

    if(cached.conn) { //if connection already exists
      return cached.conn;
    }

    if(!cached.promise) {
        //if promise does not exist, create a new one
        const opts = {
          bufferCommands: true,
          maxPoolSize: 10
        }
        cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=> mongoose.connection);
   }

   try{
      cached.conn = await cached.promise;  // Wait for the promise to resolve
   }

   catch (e) {
      cached.promise = null;  //incase of error, reset the promise
      throw e;
   }
   
   return cached.conn;
}