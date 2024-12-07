import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import SubjectModule from '../modules/SubjectModule';

@Service()
export default class SubjectController {
  constructor(public requestModule: SubjectModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getSubjectRequest(req);
    return response;
  });

  createSubject = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createSubjectRequest(req);
    return response;
  });

  updateSubject = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateSubjectRequest(req);
    return response;
  });

  deleteSubject = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteSubjectRequest(req);
    return response;
  });
}
