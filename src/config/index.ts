import dotenv from 'dotenv';
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config(); //dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
};

export enum MODES {
  TEST = 'test',
  LOCAL = 'local',
  DEV = 'development',
  PROD = 'production',
}
