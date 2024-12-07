import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IExam extends Document {
  uuid: string;
  school_id: string;
  class_id: string;
  subject_id: string;
  slug: string;
  type: string;
  category: string;
  duration: number;
  aggregate_score: number;
  minimum_pass_score: number;
  description: string;
  name: string;
  published: number;
  status: number;
  created_at?: Date;
  updated_at?: Date;
  isDeleted?: boolean;
  questions_count?: number;
  responses: number;
  hasStarted?: boolean;
  hasCompleted?: boolean;
  score?: number;
  passed?: number;
  failed?: number;
  count?: number;
  term: string;
  session: string;
}

// Define the schema for the Student model with timestamps
const ExamSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    class_id: {
      type: String,
      required: true, // Must be provided
    },
    subject_id: {
      type: String,
      required: false, // Not required
    },
    slug: {
      type: String,
      required: false,
      default: '', // If not provided, defaults to an empty string
    },
    type: {
      type: String,
      required: false,
      default: '', // If not provided, defaults to an empty string
    },
    category: {
      type: String,
      default: '', // Optional, can be an empty string if not provided
    },
    duration: {
      type: Number,
      required: false, // Not required
    },
    aggregate_score: {
      type: Number,
      required: false, // Not required
    },
    minimum_pass_score: {
      type: Number,
      required: false, // Not required
    },
    description: {
      type: String,
      required: false, // Not required
    },
    name: {
      type: String,
      required: false, // Not required
    },
    published: {
      type: Number,
      default: 0,
      required: false, // Not required
    },
    responses: {
      type: Number,
      default: 0,
      required: false, // Not required
    },
    status: {
      type: Number,
      default: 0,
      required: false, // Not required
    },
    score: {
      type: Number,
      default: 0,
      required: false, // Not required
    },
    term: {
      type: String,
      required: false,
    },
    session: {
      type: String,
      required: false,
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
const Exam = mongoose.model<IExam>('examinations', ExamSchema);

export default Exam;
