// src/models/referralModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  userId: string;
  referralCode: string;
  referredBy: string | null;
}

const referralSchema = new Schema<IReferral>({
  userId: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, default: null },
});

const Referral = mongoose.model<IReferral>('Referral', referralSchema);
export default Referral;
