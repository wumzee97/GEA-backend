import { Service } from 'typedi';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import OtpTable from '../models/otptable.model';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomString } from '../utils/Helpers';
import { sendActivationMail } from '../mailer/activationMail';
import { EmailOptions } from '../mailer/interface/EmailOptions';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import moment from 'moment';
import slugify from 'slugify';
import { uploadFileToS3 } from '../services/S3Client';
import * as Utils from '../utils';
import * as fs from 'fs';
import Parent from '../models/parents.model';
import Child, { IChild } from '../models/child.model';
import { SignSignature } from '../utils';
import mongoose from 'mongoose';
import Tutor from '../models/tutors.model';

const SALT: any | undefined = process.env.SALT;

@Service()
export default class RegisterModule {
  // Method to handle registration requests
  async registerRequest(email: string, password: string, type: string) {
    // Hash the password
    const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);
    const token: string = uuidv4();

    if (type === 'parent') {
      // Check if a user with the provided email already exists
      const existingUser = await Parent.findOne({
        email,
      });
      if (!existingUser) {
        // Create a new onboarding entry
        const newUser = new Parent({
          password: hash,
          email,
          status: 0,
          token,
        });

        // const otp = await generateRandomString(6);

        // // Create an OTP entry for activation
        // const activation = new OtpTable({

        //   email,
        //   type: 'activation',
        //   status: 0,
        //   otp,
        //   expiredAt: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        // });

        await newUser.save();
        // await activation.save();

        //   const message: EmailOptions = {
        //     firstname,
        //     email,
        //     otp,
        //   };

        // try {
        //   // Dispatch email
        //   await sendActivationMail(message);
        // } catch (error) {
        //   console.error('Error sending activation mail:', error);
        // }
      }

      return new SuccessResponse({
        message: 'Account created successfully',
        data: {
          account_id: token,
        },
      });
    } else if (type === 'tutor') {
      // Check if a user with the provided email already exists
      const existingUser = await Tutor.findOne({
        email,
      });
      if (!existingUser) {
        // Create a new onboarding entry
        const newUser = new Tutor({
          password: hash,
          email,
          status: 0,
          token,
        });

        const otp = await generateRandomString(6);

        // Create an OTP entry for activation
        const activation = new OtpTable({
          email,
          type: 'activation',
          status: 0,
          otp,
          expiredAt: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        });

        await newUser.save();
        await activation.save();

        const message: EmailOptions = {
          firstname: 'Tutor',
          email,
          otp,
        };

        try {
          // Dispatch email
          await sendActivationMail(message);
        } catch (error) {
          console.error('Error sending activation mail:', error);
        }

        return new SuccessResponse({
          message: 'Account created successfully',
          data: {
            account_id: token,
          },
        });
      }
    }

    // Return error if email is already used
    return new ErrorResponse({
      message: 'Email has already been used',
    });
  }

  async updateParentProfile(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    country: string,
    account_id: string,
  ) {
    const parent = await Parent.findOne({
      token: account_id,
    });

    if (!parent) {
      return new ErrorResponse({
        message: 'Invalid account reference provided',
      });
    }

    parent.firstName = firstName;
    parent.lastName = lastName;
    parent.phoneNumber = phoneNumber;
    parent.country = country;
    parent.save();

    return new SuccessResponse({
      message: 'Parent profile updated successfully',
    });
  }

  async addChildren(account_id: string, children: IChild[]) {
    const parent = await Parent.findOne({
      token: account_id,
    });

    if (!parent) {
      return new ErrorResponse({
        message: 'Invalid account reference provided',
      });
    }

    children.forEach((child) => {
      const newChild = new Child({
        parent_id: (parent._id as mongoose.Types.ObjectId).toString(),
        age: child.age,
        class: child.class,
        name: child.name,
      });
      newChild.save();
    });

    const token = await SignSignature(parent);

    return new SuccessResponse({
      message: 'Children profile updated successfully',
      data: token,
    });
  }

  async uploadFileRequest(req: Request) {
    // Check if file is uploaded
    if (!req.file) {
      return new ErrorResponse({
        message: 'No file uploaded',
      });
    }

    // Get the file path
    const filePath = req.file.path;

    try {
      const key = await Utils.generateFileName(req.file); // Destination path in the S3 bucket
      const response = await uploadFileToS3(filePath, key);

      console.log('response result ==================');
      console.log(response);

      return new SuccessResponse({
        message: 'Data submitted successfully',
        data: response,
      });
    } catch (error) {
      return new ErrorResponse({
        message: 'Error reading file path',
        error,
      });
    } finally {
      // Delete the file after reading its contents
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File successfully deleted.');
        }
      });
    }
  }
}
