// lib/db.js
import mongoose from 'mongoose';

const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing database connection
    console.log("Using existing connection");
    return;
  }

  // Use new database connection
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'wanderwise'
    });
    console.log("DB connected.");
    connection.isConnected = db.connections[0].readyState;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }

  
}

export default connectDb;