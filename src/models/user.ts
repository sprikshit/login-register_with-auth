// src/models/userModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  password: string;
  username: string;
  countrycode: string;
  number: string;
  isVerified: boolean;
  otp: any; 
  amount: number;
  referralCode?: string;
  referredBy: any;
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  countrycode: { type: String, required: true },
  number: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: Number},
  amount: { type: Number, default: 0 },
  referralCode: { type: String },
  referredBy: { type: String, default: null }
});

const userModel = mongoose.model<IUser>('User', userSchema);
export default userModel;
