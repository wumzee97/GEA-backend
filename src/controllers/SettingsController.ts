import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import SettingsModule from '../modules/SettingsModule';

@Service()
export default class AuthController {
  constructor(public requestModule: SettingsModule) {}

  personal = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.personalRequest(req);
    return response;
  });

  updatePersonal = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updatePersonalRequest(req);
    return response;
  });

  school = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.schoolRequest(req);
    return response;
  });

  updateSchool = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateSchoolRequest(req);
    return response;
  });

  billing = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.billingRequest(req);
    return response;
  });

  updatePassword = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updatePasswordRequest(req);
    return response;
  });

  updateSession = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateSessionRequest(req);
    return response;
  });

}
