import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import LoginModule from '../modules/LoginModule';

@Service()
export default class LoginController {
  constructor(public requestModule: LoginModule) {}

  login = asyncWrapper(async (req: Request) => {
    const { email, password,type } = req.body;
    const response = await this.requestModule.loginRequest(email, password,type);
    return response;
  });

  refreshToken = asyncWrapper(async (req: Request) => {
    const { refresh_token } = req.body;
    const response = await this.requestModule.refreshTokenRequest(refresh_token);
    return response;
  });
}
