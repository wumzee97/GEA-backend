import { Service } from 'typedi';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import Onboarding from '../models/onboarding.model';
import OtpTable from '../models/otptable.model';
import School from '../models/school.model';
import Role from '../models/role.model';
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

const SALT: any | undefined = process.env.SALT;

@Service()
export default class RegisterModule {
  // Method to handle registration requests
  async registerRequest(email: string, password: string) {
    // Hash the password
    const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);
    const token: string = uuidv4();

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

      return new SuccessResponse({
        message: 'Account created successfully',
        data: {
          account_id: token,
        },
      });
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
        parent_id: (parent._id  as mongoose.Types.ObjectId).toString(),
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

  async confirmCodeRequest(account_id: string, code: string) {
    // Check if a user with the provided email already exists
    const codeCheck = await OtpTable.findOne({
      uuid: account_id,
    });

    if (codeCheck) {
      if (codeCheck.otp == code) {
        if (codeCheck.status == 0) {
          //check expiry
          if (moment(codeCheck.expiredAt).isBefore(moment())) {
            return new ErrorResponse({
              message: 'Expired token',
            });
          }

          codeCheck.status = 1;
          await codeCheck.save();

          const onboardingUser = await Onboarding.findOne({
            token: account_id,
          });

          if (onboardingUser) {
            onboardingUser.status = 1;
            await onboardingUser?.save();

            const user = new User({
              uuid: account_id,
              firstname: onboardingUser.firstname,
              lastname: onboardingUser.lastname,
              password: onboardingUser.password,
              email: onboardingUser.email,
              //role_id: 'super_admin',
            });

            user.uuid = user.id;
            await user.save();

            return new SuccessResponse({
              message: 'Account activated successfully',
              data: {
                account_id: user.id,
              },
            });
          }
        } else {
          //used code
          return new ErrorResponse({
            message: 'Activation code has already been used',
          });
        }
      } else {
        //invalid code
        return new ErrorResponse({
          message: 'Invalid activation code',
        });
      }
    } else {
      //invalid token
      return new ErrorResponse({
        message: 'Invalid token',
      });
    }
  }

  async resendCodeRequest(account_id: string) {
    const onboardingUser = await Onboarding.findOne({
      token: account_id,
    });

    if (!onboardingUser) {
      return new ErrorResponse({
        message: 'Invalid token',
      });
    }

    if (onboardingUser.status == 1) {
      return new ErrorResponse({
        message: 'Acccount has been activated',
      });
    }

    const otp = await generateRandomString(6);

    // Create an OTP entry for activation
    const activation = await OtpTable.findOne({
      uuid: account_id,
    });

    if (activation) {
      activation.otp = otp;
      await activation.save();

      const message: EmailOptions = {
        firstname: onboardingUser.firstname,
        email: onboardingUser.email,
        otp,
      };

      try {
        // Dispatch email
        await sendActivationMail(message);
      } catch (error) {
        console.error('Error sending activation mail:', error);
      }

      return new SuccessResponse({
        message: 'Activation code resent successfully',
        data: {
          account_id: account_id,
          otp,
        },
      });
    }
  }

  async schoolDetailRequest(
    account_id: string,
    school_name: string,
    website: string,
    sub_domain: string,
    phone: string,
    country: string,
    state: string,
    address: string,
  ) {
    const user = await User.findOne({
      uuid: account_id,
    });

    if (!user) {
      return new ErrorResponse({
        message: 'Account does not exist',
      });
    }

    if (user.school_id != null) {
      return new ErrorResponse({
        message: 'School already added to account',
      });
    }

    const school_id: string = uuidv4();
    const school = new School({
      uuid: school_id,
      user_id: account_id,
      name: school_name,
      website,
      phone,
      sub_domain,
      country,
      state,
      address,
    });

    //create roles with permission and add role _id to the user
    const uuid: string = uuidv4();

    const roles = new Role({
      uuid,
      school_id,
      slug: slugify('Super Admin'.toLowerCase()),
      name: 'Super Admin',
      description: 'Super Admin',
    });

    user.status = 'active';
    roles.uuid = roles.id;
    roles.school_id = school.id;
    school.uuid = school.id;

    user.school_id = school.id;
    user.role_id = roles.id;

    await user.save();
    await roles.save();
    await school.save();

    return new SuccessResponse({
      message: 'Data submitted successfully',
      data: {
        account_id: account_id,
      },
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
