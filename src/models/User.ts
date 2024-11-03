import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  userId: string;
  email: string;
  password: string;
  emailVerified: boolean;
  userName: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema: Schema<User> = new Schema({
	userId: {
		type: String,
		required: [true, "User ID is required"],
		unique: true,
	},
	userName: {
		type: String,
		unique: true,
		trim: true,
	},
	fullName: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		required: true,
    trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	emailVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
