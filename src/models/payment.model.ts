import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IPayment extends Document {
  user_id: string;
  school_id: string;
  reference: string;
  amount: string;
  plan_id: string;
  payment_link: string;
  type: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const PaymentSchema: Schema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true, // Must be provided
    },
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    reference: {
      type: String,
      required: true, // Must be provided
    },
    amount: {
      type: String,
      required: false, // Not required
    },
    plan_id: {
      type: String,
      required: false,
    },
    payment_link: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Payment = mongoose.model<IPayment>('payments', PaymentSchema);

export default Payment;
