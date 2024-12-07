import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IExamTimeLog extends Document {
  my_exam_id: string;
  type: string;
  startTime: string;
  endTime: string;
  quitTime: Date;
  submisssionTime: Date;
  timeRemaining: string;
}

// Define the schema for the Student model with timestamps
const ExamTimeLogSchema: Schema = new mongoose.Schema(
  {
    my_exam_id: {
      type: String,
      required: true, // Must be provided
    },
    type: {
      type: String,
      required: true, // Must be provided
    },
    startTime: {
      type: String,
      required: false, // Must be provided
    },
    endTime: {
      type: String,
      required: false, // Not required
    },
    quitTime: {
      type: Date,
      required: false, // If not provided, defaults to an empty string
    },
    submissionTime: {
      type: Date,
      required: false, // If not provided, defaults to an empty string
    },
    timeRemaining: {
      type: String,
      required: false, // Optional, can be an empty string if not provided
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const ExamTimeLog = mongoose.model<IExamTimeLog>('exam_time_logs', ExamTimeLogSchema);

export default ExamTimeLog;
