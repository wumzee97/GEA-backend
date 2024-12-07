import { Service } from 'typedi';
import OtpTable from '../models/otptable.model';
import User from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { generateRandomString } from '../utils/Helpers';
import { EmailOptions } from '../mailer/interface/EmailOptions';
import { sendPasswordResetMail } from '../mailer/PasswordResetMail';
import { SuccessResponse, ErrorResponse } from '../utils/Response';

const SALT: any | undefined = process.env.SALT;

@Service()
export default class PasswordResetModule {
  async passwordResetRequest(email: string, callback_url: string) {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return new ErrorResponse({
        message: 'Unable to fetch account details',
      });
    }

    const token: string = uuidv4();
    const otp = await generateRandomString(6);

    // Create an OTP entry for activation
    const activation = new OtpTable({
      uuid: token,
      email: user.email,
      type: 'passwordreset',
      status: 0,
      otp,
      expiredAt: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
    });

    await activation.save();

    const message: EmailOptions = {
      firstname: user.firstname,
      email: user.email,
      otp: token,
      url: callback_url,
    };

    try {
      // Dispatch email
      await sendPasswordResetMail(message);
    } catch (error) {
      console.error('Error sending activation mail:', error);
    }

    return new SuccessResponse({
      message: 'Kindly check your email for reset link!',
    });
  }

  async validateTokenRequest(token: string) {
    const activation = await OtpTable.findOne({
      uuid: token,
    });

    if (!activation) {
      return new ErrorResponse({
        message: 'Invalid Token',
      });
    }

    if (activation.status == 1) {
      return new ErrorResponse({
        message: 'Password Token has expired',
      });
    }

    //check expiry status
    if (moment(activation.expiredAt).isBefore(moment())) {
      return new ErrorResponse({
        message: 'Expired token',
      });
    }

    return new SuccessResponse({
      message: 'Valid Token',
    });
  }

  async updatePasswordRequest(password: string, token: string) {
    const activation = await OtpTable.findOne({
      uuid: token,
      type: 'passwordreset',
    });

    if (!activation) {
      return new ErrorResponse({
        message: 'Invalid Token',
      });
    }

    if (activation.status == 1) {
      return new ErrorResponse({
        message: 'Password Token has expired',
      });
    }

    //check expiry status
    if (moment(activation.expiredAt).isBefore(moment())) {
      return new ErrorResponse({
        message: 'Expired token',
      });
    }

    const user = await User.findOne({
      email: activation.email,
    });

    if (!user) {
      return new ErrorResponse({
        message: 'User not found',
      });
    }

    const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);

    user.password = hash;
    await user.save();

    activation.status = 1;
    await activation.save();

    return new SuccessResponse({
      message: 'Password updated successfully',
    });
  }
}
