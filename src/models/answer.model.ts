import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Option and Anwser documents
interface IOption {
  text: string;
  image: string;
  is_correct: boolean;
  selected?: boolean;
}

export interface IAnswer extends Document {
  student_id: string;
  exam_id: string;
  type: string;
  question_text: string;
  question_image: string;
  answerType: string;
  theoryAnswer?: string;
  skipped?: boolean;
  submitted?: boolean;
  options: IOption[];
  mark?: number
}

// Define the schema for the Anwser model
const AnswerSchema: Schema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true, // Must be provided
  },
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
  theoryAnswer: {
    type: String,
    required: false, // Must be provided
  },
  skipped: {
    type: Boolean,
    required: false, // Must be provided
    default: false, // Default to false if not provided
  },
  submitted: {
    type: Boolean,
    required: false, // Must be provided
    default: false, // Default to false if not provided
  },
  mark: {
    type: Number,
    required: false,
  },
  options: [
    {
      text: {
        type: String, // Must be provided
        default: '', // If not provided, defaults to an empty string
        required: false, // Must be provided
      },
      image: {
        type: String,
        default: '', // Optional, can be an empty string if not provided
        required: false, // Must be provided
      },
      is_correct: {
        type: Boolean,
        required: false, // Must be provided
        default: false, // Default to false if not provided
      },
      selected: {
        type: Boolean,
        required: false, // Must be provided
        default: false, // Default to false if not provided
      },
    },
  ],
});

// Create the model from the schema
const Answer = mongoose.model<IAnswer>('answers', AnswerSchema);

export default Answer;
