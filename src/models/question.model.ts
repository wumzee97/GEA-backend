import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Option and Question documents
interface IOption {
  text: string;
  image: string;
  is_correct: boolean;
}

export interface IQuestion extends Document {
  exam_id: string;
  type: string;
  question_text: string;
  question_image: string;
  answerType: string;
  skipped?: boolean;
  theoryAnswer?: string;
  options?: IOption[];
  mark?: number
}

// Define the schema for the Question model
const QuestionSchema: Schema = new mongoose.Schema({
  exam_id: {
    type: String,
    required: true, // Must be provided
  },
  type: {
    type: String,
    required: true, // Must be provided
  },
  question_text: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  question_image: {
    type: String,
    default: '', // Optional, can be an empty string if not provided
  },
  answerType: {
    type: String,
    required: false, // Must be provided
  },
  mark: {
    type: Number,
    required: false,
  },
  options: [
    {
      text: {
        type: String, // Must be provided
        required: false, // Must be provided
        default: '', // If not provided, defaults to an empty string
      },
      image: {
        type: String,
        required: false, // Must be provided
        default: '', // Optional, can be an empty string if not provided
      },
      is_correct: {
        type: Boolean,
        required: false, // Must be provided
        default: false, // Default to false if not provided
      },
    },
  ],
});

// Create the model from the schema
const Question = mongoose.model<IQuestion>('questions', QuestionSchema);

export default Question;
