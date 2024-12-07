import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
  googleId?: string;
  avatar?:string;
  token: string;
}

// Define the schema for the parent model
const ParentSchema: Schema = new mongoose.Schema({
  firstName: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  lastName: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  email: {
    type: String,
    required: true, // Must be provided
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  avatar: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },
  token: {
    type: String,
    default: '', // If not provided, defaults to an empty string
  },

});

// Create the model from the schema
const Parent = mongoose.model<IParent>('parents', ParentSchema);

export default Parent;
