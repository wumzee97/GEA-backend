import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IOauth extends Document {
  user_id: string;
  email: string;
  type: string;
  iat: string;
  exp: string;
}

// Define the schema for the Student model with timestamps
const OauthSchema: Schema = new mongoose.Schema(
  {
    user_id: {
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
    iat: {
      type: String,
      required: false, // Not required
    },
    exp: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Oauth = mongoose.model<IOauth>('oauths', OauthSchema);

export default Oauth;
