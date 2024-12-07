import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the My document
export interface IMyExam extends Document {
  school_id: string;
  exam_id: string;
  student_id: string;
  startTime: Date;
  endTime: Date;
  quitStatus: boolean;
  hasQuitted: boolean;
  quitRemainingTime: number;
  quitStartTime: Date;
  extraTime: string;
  estimatedEndTime: Date;
  unlimitedTime: boolean;
  timeRemaining: string;
  hasStarted?: boolean;
  hasCompleted?: boolean;
  skipped_question_count?: number;
  status?: number;
  score?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Define the schema for the My model with timestamps
const MyExamSchema: Schema = new mongoose.Schema(
  {
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    exam_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Class model
      ref: 'examinations', // Ensure this matches the model name of the Class model
      required: false,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Class model
      ref: 'students', // Ensure this matches the model name of the Class model
      required: false,
    },
    startTime: {
      type: Date,
      required: false, // Not required
    },
    endTime: {
      type: Date,
      required: false, // Not required
    },
    quitStatus: {
      type: Boolean,
      default: false,
      required: false, // Not required
    },
    quitStartTime: {
      type: Date,
      required: false, // Not required
    },
    hasQuitted: {
      type: Boolean,
      default: false,
      required: false, // Not required
    },
    extraTime: {
      type: String,
      required: false, // Not required
    },
    quitRemainingTime: {
      type: Number,
      default: 0,
      required: false, // Not required
    },
    timeRemaining: {
      type: String,
      default: '0',
      required: false, // Not required
    },
    estimatedEndTime: {
      type: Date,
      required: false, // Not required
    },
    unlimitedTime: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasStarted: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasCompleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    skipped_question_count: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      //start  assessment, continue assessment, view results
      type: Number,
      required: false,
      default: 1,
    },
    score: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const MyExam = mongoose.model<IMyExam>('my_exam', MyExamSchema);

export default MyExam;
