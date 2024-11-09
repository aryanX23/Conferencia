import mongoose from "mongoose";

const { MONGODB_URI = '' } = process.env || {};

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

const connectDatabase = async (): Promise<void> => {
	try {
		if (connection.isConnected) {
			console.log("Already connected to database");
    }
    
    const db = await mongoose.connect(MONGODB_URI, {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully...")
  } catch (error) {
    console.log("Database connection failed! ", error);
    process.exit(1);
  }
};

export default connectDatabase;