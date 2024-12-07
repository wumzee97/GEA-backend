import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import AuthModule from '../modules/AuthModule';

@Service()
export default class AuthController {
  constructor(public requestModule: AuthModule) {}

  profile = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.profileRequest(req);
    return response;
  });

  dashboard = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.dashboardRequest(req);
    return response;
  });
}
