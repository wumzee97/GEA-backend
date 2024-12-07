import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IStudent extends Document {
  school_id: string;
  class_id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender: string;
  picture: string;
  status?: number;
  isDeleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Define the schema for the Student model with timestamps
const StudentSchema: Schema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Class model
      ref: 'class', // Ensure this matches the model name of the Class model
      required: false,
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
    gender: {
      type: String,
      required: false, // Not required
    },
    picture: {
      type: String,
      required: false, // Not required
    },
    status: {
      type: Number,
      default: 0,
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
const Student = mongoose.model<IStudent>('students', StudentSchema);

export default Student;
