import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import ClassModule from '../modules/ClassModule';

@Service()
export default class ClassController {
  constructor(public requestModule: ClassModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getClassRequest(req);
    return response;
  });

  createClass = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createClassRequest(req);
    return response;
  });

  updateClass = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateClassRequest(req);
    return response;
  });

  deleteClass = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteClassRequest(req);
    return response;
  });
}
