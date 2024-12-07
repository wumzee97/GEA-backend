import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IOtpTable extends Document {
  uuid: string;
  email: string;
  type: string;
  otp: string;
  status: number;
  completedAt: Date;
  expiredAt: Date;
}

// Define the schema for the Student model with timestamps
const OtpTableSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    email: {
      type: String,
      required: true, // Must be provided
    },
    type: {
      type: String,
      required: true, // Must be provided
    },
    otp: {
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
    completedAt: {
      type: Date,
      required: false,
    },
    expiredAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const OtpTable = mongoose.model<IOtpTable>('otp_table', OtpTableSchema);

export default OtpTable;
