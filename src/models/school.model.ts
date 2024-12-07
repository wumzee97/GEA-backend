import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Student document
export interface ISchool extends Document {
  user_id: string;
  uuid: string;
  name: string;
  website: string;
  phone: string;
  sub_domain: string;
  country: string;
  state: string;
  address: string;
  logo: string;
  term: string;
  session: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Student model with timestamps
const SchoolSchema: Schema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true, // Must be provided
    },
    user_id: {
      type: String,
      required: true, // Must be provided
    },
    name: {
      type: String,
      required: true, // Must be provided
    },
    website: {
      type: String,
      required: false, // Not required
    },
    phone: {
      type: String,
      required: false,
    },
    sub_domain: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    term: {
      type: String,
      required: false,
    },
    session: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
  },
);

// Create the model from the schema
const School = mongoose.model<ISchool>('school', SchoolSchema);

export default School;

//Number of CA (continuous assessments)
//CA score weight: e.g 30 or 40
//Exam weight: e.g 70 or 60
//Academic session
//complete academic calendar
