import { Service } from 'typedi';
import bcrypt from 'bcrypt';
import { SignSignature, IssueTutorSignature } from '../utils/UserSignature';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import * as Utils from '../utils';
import Parent from '../models/parents.model';
import Tutor from '../models/tutors.model';
import Child from '../models/child.model';

// Secret keys for signing the tokens
const accessTokenSecret: Secret = process.env.SECRET_KEY ?? 'process.env.SECRET_KEY';

@Service()
export default class LoginModule {
  // Method to handle login requests
  async loginRequest(email: string, password: string, type: string) {
    if (!type) {
      return new ErrorResponse({
        message: 'No user type specified',
      });
    }

    if (type == 'parent') {
      // Find the user with the provided email
      const user = await Parent.findOne({
        email,
      });
      if (user) {
        // Compare provided password with the hashed password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
          const children = await Child.find({ parent_id: user._id });
          // Generate a token if the password is correct
          const token = await SignSignature(user);
          const hasUpdatedProfile = user.firstName ? true : false;
          const hasAddedChildren = children.length ? true : false;
          console.log('Me: ', user);
          console.log('My children: ', children);

          const data = {
            ...token,
            hasAddedChildren,
            hasUpdatedProfile,
            account_id: user.token,
          };

          return new SuccessResponse({
            message: 'Logged in successfully',
            data: data,
          });
        }

        // Return error if the password is incorrect
        return new ErrorResponse({
          message: 'Incorrect password',
        });
      }

      // Return error if the email is incorrect
      return new ErrorResponse({
        message: 'Incorrect email',
      });
    } else if (type == 'tutor') {
      // Find the user with the provided email
      const user = await Tutor.findOne({
        email,
      });
      if (user) {
        // Compare provided password with the hashed password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
          // Generate a token if the password is correct
          const token = await IssueTutorSignature(user);

          return new SuccessResponse({
            message: 'Logged in successfully',
            data: token,
          });
        }

        // Return error if the password is incorrect
        return new ErrorResponse({
          message: 'Incorrect password',
        });
      }

      // Return error if the email is incorrect
      return new ErrorResponse({
        message: 'Incorrect email',
      });
    } else {
      return new ErrorResponse({
        message: 'Invalid user type specified',
      });
    }
  }

  // Method to handle refresh token requests
  async refreshTokenRequest(refreshToken: string) {
    if (!refreshToken) {
      return new ErrorResponse({
        message: 'Refresh token is required',
      });
    }

    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, accessTokenSecret) as JwtPayload;

      console.log(decoded);

      if (decoded.type == 'parent') {
        // Find the user based on the decoded email
        const user = await Parent.findOne({
          email: decoded.email,
        });

        console.log(user);
        console.log('=====================');

        if (!user) {
          return new ErrorResponse({
            message: 'Invalid refresh token',
          });
        }

        const token = await SignSignature(user);

        // Return a new token if the refresh token is valid
        return new SuccessResponse({
          message: 'Token refreshed successfully',
          data: token,
        });
      } else {
        const user = await Tutor.findOne({
          email: decoded.email,
        });

        console.log(user);
        console.log('=====================');

        if (!user) {
          return new ErrorResponse({
            message: 'Invalid refresh token',
          });
        }

        // Generate a token if the password is correct
        const token = await IssueTutorSignature(user);

        return new SuccessResponse({
          message: 'Token refreshed successfully',
          data: token,
        });
      }
    } catch (err) {
      return new ErrorResponse({
        message: 'An error occurred, Kindly try again',
      });
    }
  }
}
