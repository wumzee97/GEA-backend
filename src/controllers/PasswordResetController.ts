import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import PasswordResetModule from '../modules/PasswordResetModule';

@Service()
export default class PasswordResetController {
  constructor(public requestModule: PasswordResetModule) {}

  passwordReset = asyncWrapper(async (req: Request) => {
    const { email, callback_url } = req.body;
    const response = await this.requestModule.passwordResetRequest(email, callback_url);
    return response;
  });

  validateToken = asyncWrapper(async (req: Request) => {
    const { token } = req.body;
    const response = await this.requestModule.validateTokenRequest(token);
    return response;
  });

  updatePassword = asyncWrapper(async (req: Request) => {
    const { password, token } = req.body;
    const response = await this.requestModule.updatePasswordRequest(password, token);
    return response;
  });
}
