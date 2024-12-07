import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface ISetting extends Document {
  name: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const SettingSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Must be provided
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
const Setting = mongoose.model<ISetting>('settings', SettingSchema);

export default Setting;
