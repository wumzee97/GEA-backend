import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface IClass extends Document {
  uuid: string;
  school_id: string;
  name: string;
  description: string;
  numberOfStudent?: number;
  deleted?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Define the schema for the Student model with timestamps
const ClassSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: false,
    },
    school_id: {
      type: String,
      required: true, // Must be provided
    },
    name: {
      type: String,
      required: true, // Must be provided
    },
    description: {
      type: String,
      required: false, // Not required
    },
    deleted: {
      type: Number,
      required: false,
      default: 0, // Default is not deleted
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const Class = mongoose.model<IClass>('class', ClassSchema);

export default Class;
