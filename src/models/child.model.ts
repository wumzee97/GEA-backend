import mongoose, { Schema, Document } from 'mongoose';

export interface IChild extends Document {
  parent_id: string;
  name: string;
  class: string;
  age: number;
}

// Define the schema for the parent model
const ParentSchema: Schema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Class model
    ref: 'parents', // Ensure this matches the model name of the Class model
    required: true,
  },
  name: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  class: {
    type: String,
    required: true, // Must be provided
  },
  age: {
    type: Number,
    default: 0,
  },
});

// Create the model from the schema
const Child = mongoose.model<IChild>('child', ParentSchema);

export default Child;
