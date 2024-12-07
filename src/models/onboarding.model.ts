import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IOnboarding extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  token: string;
  status: number;
}

// Define the schema for the Student model with timestamps
const OnboardingSchema: Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true, // Must be provided
    },
    lastname: {
      type: String,
      required: true, // Must be provided
    },
    email: {
      type: String,
      required: true, // Must be provided
    },
    password: {
      type: String,
      required: false, // Not required
    },
    token: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Onboarding = mongoose.model<IOnboarding>('onboarding', OnboardingSchema);

export default Onboarding;
