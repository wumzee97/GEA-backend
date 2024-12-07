import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IPlan extends Document {
  uuid: string;
  name: string;
  amount: string;
  period_days: number;
  value: [string];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const PlanSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    name: {
      type: String,
      required: true, // Must be provided
    },
    amount: {
      type: String,
      required: true, // Must be provided
    },
    period_days: {
      type: String,
      required: false, // Not required
    },
    value: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Plan = mongoose.model<IPlan>('plans', PlanSchema);

export default Plan;
