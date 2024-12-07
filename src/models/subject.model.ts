import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Subject document
export interface ISubject extends Document {
  uuid: string;
  school_id: string;
  slug: string;
  name: string;
  description: string;
  isDeleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Define the schema for the Subject model with timestamps
const SubjectSchema: Schema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    // uuid: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'class', // Ensure this matches the model name of the Class
    //   required: true, // Must be provided
    // },
    uuid: {
      type: String,
      required: false, // Not required
    },
    slug: {
      type: String,
      required: false, // Not required
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      default: '', // If not provided, defaults to an empty string
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
const Subject = mongoose.model<ISubject>('subjects', SubjectSchema);

export default Subject;
