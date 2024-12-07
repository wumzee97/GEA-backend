import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface ISubscription extends Document {
  user_id: string;
  school_id: string;
  plan_id: string;
  current_period_start: Date;
  current_period_end: Date;
  amount: string;
  total: string;
  reference: string;
  category: string;
  period_days: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const SubscriptionSchema: Schema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true, // Must be provided
    },
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    plan_id: {
      type: String,
      required: true, // Must be provided
    },
    current_period_start: {
      type: Date,
      required: false, // Not required
    },
    current_period_end: {
      type: Date,
      required: false,
    },
    amount: {
      type: String,
      required: false,
    },
    total: {
      type: String,
      required: false,
    },
    reference: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    period_days: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Subscription = mongoose.model<ISubscription>('subscriptions', SubscriptionSchema);

export default Subscription;
