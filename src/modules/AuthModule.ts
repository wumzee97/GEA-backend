import { Service } from 'typedi';
import { Request } from 'express';
import * as Utils from '../utils';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import User from '../models/user.model';

@Service()
export default class AuthModule {
  async profileRequest(req: Request) {
    const user = await Utils.currentUser(req);
    return new SuccessResponse({
      message: 'User profile retrieved successfully.',
      data: await Utils.formatUser(user),
    });
  }

  
}
