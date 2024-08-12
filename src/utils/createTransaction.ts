import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models/transaction'; // Adjust the import path based on your project structure

interface CreateTransactionOptions {
  userId: string;
  amount: number;
  remark: string;
}

export async function createTransaction(
  userId: string,
  amount: number,
  remark: string
): Promise<void> {
  const transaction = new Transaction({
    userId,
    transactionId: uuidv4(),
    amount,
    remark,
  });
  
  await transaction.save();
}
