import mongoose, { Schema, Document } from 'mongoose';

export interface ITutor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Define the schema for the tutor model
const TutorSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // Must be provided
  },
  lastName: {
    type: String,
    required: true, // Must be provided
  },
  email: {
    type: String,
    required: true, // Must be provided
  },
  password: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
});

// Create the model from the schema
const Tutor = mongoose.model<ITutor>('tutors', TutorSchema);

export default Tutor;
