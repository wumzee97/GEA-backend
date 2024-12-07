import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import ExamModule from '../modules/ExamModule';

@Service()
export default class ExamController {
  constructor(public requestModule: ExamModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getExamRequest(req);
    return response;
  });

  index = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.indexRequest(req);
    return response;
  });

  viewExam = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.viewExamRequest(req);
    return response;
  });

  createExam = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createExamRequest(req);
    return response;
  });

  publishExam = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.publishExamRequest(req);
    return response;
  });

  updateExam = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateExamRequest(req);
    return response;
  });

  deleteExam = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteExamRequest(req);
    return response;
  });
}
