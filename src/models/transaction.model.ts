import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface ITransaction extends Document {
  plan_id: string;
  reference: string;
  amount: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const TransactionSchema: Schema = new mongoose.Schema(
  {
    plan_id: {
      type: String,
      required: true, // Must be provided
    },
    reference: {
      type: String,
      required: true, // Must be provided
    },
    amount: {
      type: String,
      required: true, // Must be provided
    },
    status: {
      type: String,
      required: false, // Not required
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Transaction = mongoose.model<ITransaction>('transactions', TransactionSchema);

export default Transaction;
