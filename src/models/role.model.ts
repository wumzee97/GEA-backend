import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Option and Question documents
interface IPermission {
  name: string;
  value: string;
}

// Define an interface for the Student document
export interface IRole extends Document {
  uuid: string;
  school_id: string;
  slug: string;
  name: string;
  description: string;
  permission: IPermission[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt: Date;
}

// Define the schema for the Student model with timestamps
const RoleSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    slug: {
      type: String,
      required: true, // Must be provided
    },
    name: {
      type: String,
      required: false, // Not required
    },
    description: {
      type: String,
      required: false,
    },
    permission: [
      {
        name: {
          type: String, // Must be provided
          required: false, // If not provided, defaults to an empty string
        },
        value: {
          type: String,
          required: false, // Optional, can be an empty string if not provided
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Role = mongoose.model<IRole>('roles', RoleSchema);

export default Role;
