import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import MembersModule from '../modules/MembersModule';

@Service()
export default class MembersController {
  constructor(public requestModule: MembersModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getMemberRequest(req);
    return response;
  });

  createMember = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createMemberRequest(req);
    return response;
  });

  updateMember = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateMemberRequest(req);
    return response;
  });

  deleteMember = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteMemberRequest(req);
    return response;
  });
}
