import moment from 'moment';
import { Request } from 'express';
import { ErrorResponse } from './Response';
import multer from 'multer';
import path from 'path';

interface ExtendedRequest extends Request {
  user?: any;
}

interface Question {
  'Question Type': string;
  'Answer Type': string;
  'Question Text': string;
  'Option A': string;
  'Option B': string;
  'Option C': string;
  'Option D': string;
  'Correct Answer': string;
}

interface MulterFile {
  fieldname: string; // The field name specified in the form
  originalname: string; // The name of the file on the user's computer
  encoding: string; // The encoding type of the file
  mimetype: string; // The MIME type of the file (e.g., 'image/png')
  size: number; // The size of the file in bytes
  destination: string; // The folder to which the file has been saved
  filename: string; // The name of the file within the destination
  path: string; // The full path to the uploaded file
}

export const generateOTP = async () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const timestamp = async () => {
  return (Date.now() / 1000) | 0;
};

export const generateRandomString = async (length: number): Promise<string> => {
  let result = '';
  const characters = '123456789123456789123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const generateTimeString = async (): Promise<string> => {
  const currentTime = moment().format('MMDDHHmmss');
  return currentTime;
};

export const generateStaticTimeString = async (): Promise<string> => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return currentTime;
};

export const sessionId = async (): Promise<string> => {
  const timestamp: string = await generateTimeString();
  const randNumber: string = await generateRandomString(12);
  return '00001224' + timestamp + randNumber;
};

export const currentUser = async (request: Request) => {
  return (request as ExtendedRequest).user;
};

export const formatUser = async (user: any) => {
  const { _id,firstName, lastName, email, phoneNumber, country, googleId, avatar, token } = user;
  return {
    _id,
    firstName,
    lastName,
    email,
    phoneNumber,
    country,
    googleId,
    avatar,
    token,
  };
};

//export const formatPlans = async (plans: Plan[]): Promise<Plan[]> => {
export const formatPlans = async (plans: any[]): Promise<any[]> => {
  const formattedPlans = plans.map((plan) => {
    // Assuming 'value' is a JSON string that needs to be parsed
    plan.amount = Number(plan.amount).toFixed(2);
    //plan.value = JSON.parse(plan.value);
    return plan;
  });

  return formattedPlans;
};

export const getExactTime = (currentTime: Date): string => {
  // Extract hours, minutes, and seconds
  let hours: number | string = currentTime.getHours();
  let minutes: number | string = currentTime.getMinutes();
  let seconds: number | string = currentTime.getSeconds();

  // Format the time with leading zeros if needed
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${hours}:${minutes}:${seconds}`;
};

export const getTimeDifference = (startTime: Date, endTime: Date) => {
  // Get the remaining time in milliseconds
  const remainingTime = endTime.getTime() - startTime.getTime();
  // Convert milliseconds to minutes and seconds
  const remainingMinutes = Math.floor(remainingTime / (1000 * 60)); // Convert to minutes
  const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000); // Convert to seconds
  console.log(`Remaining Time: ${remainingMinutes} minutes and ${remainingSeconds} seconds`);
  return `${remainingMinutes}`;
};

export const checkKeyExists = (key: string, obj: object): boolean => {
  return key in obj;
};

export const checkQuestionKeyExists = (question: Question): boolean => {
  const requiredKeys = [
    'Question Type',
    'Answer Type',
    'Question Text',
    'Option A',
    'Option B',
    'Option C',
    'Option D',
  ];

  // Check if any required key is missing
  return requiredKeys.some((key) => !checkKeyExists(key, question));
};

export const checkTheoryKeyExists = (question: Question): boolean => {
  const requiredKeys = ['Question Type', 'Question Text'];

  // Check if any required key is missing
  return requiredKeys.some((key) => !checkKeyExists(key, question));
};

export const generateFileName = (file: MulterFile) => {
  const { filename, originalname } = file;
  const ext = originalname.split('.').pop(); // Get the file extension
  return `${filename}.${ext}`; // Template literals for better readability
};

// Set up Multer for file uploads (specify the upload destination)
export const uploader = multer({
  dest: path.join(__dirname, '../uploads'), // Save uploaded files in the 'uploads' folder
});
