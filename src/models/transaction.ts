import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  transactionId: string;
  amount: number;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  userId: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  remark: { type: String, required: true },
}, {
  timestamps: true, 
});

export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
