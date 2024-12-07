import mongoose, { Schema, Document } from 'mongoose';
import { IRole } from './role.model';

// Define an interface for the User document
export interface IUser extends Document {
  uuid: string;
  school_id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  role_id: string;
  gender: string;
  avatar: string;
  status?: string;
  invited_by: string;
  isDeleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  role?: any; // Add the optional role property
}

// Define the schema for the User model with timestamps
const Userschema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    //   class_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'class', // Ensure this matches the model name of the Class
    //     required: true, // Must be provided
    //   },
    school_id: {
      type: String,
      required: false, // Not required
    },
    role_id: {
      type: String,
      required: false, // Not required
    },
    firstname: {
      type: String,
      required: false, // Not required
    },
    lastname: {
      type: String,
      required: false,
      default: '', // If not provided, defaults to an empty string
    },
    password: {
      type: String,
      required: false,
      default: '', // If not provided, defaults to an empty string
    },
    email: {
      type: String,
      default: '', // Optional, can be an empty string if not provided
    },
    phone: {
      type: String,
      default: '', // Optional, can be an empty string if not provided
    },
    gender: {
      type: String,
      required: false, // Not required
    },
    avatar: {
      type: String,
      required: false, // Not required
    },
    status: {
      type: String,
      default: 'pending',
      required: false, // Not required
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false, // Default is not deleted
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const User = mongoose.model<IUser>('users', Userschema);

export default User;
