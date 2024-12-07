import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import QuestionModule from '../modules/QuestionModule';

@Service()
export default class QuestionController {
  constructor(public requestModule: QuestionModule) {}

  createQuestions = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createQuestionsRequest(req);
    return response;
  });

  bulkQuestionDelete = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.bulkQuestionDeleteRequest(req);
    return response;
  });

  updateQuestion = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateQuestionRequest(req);
    return response;
  });

  markTheoryQuestion = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.markTheoryQuestionRequest(req);
    return response;
  });

  bulkUpload = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.bulkUploadRequest(req);
    return response;
  });

  bulkUploadTheory = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.bulkUploadTheory(req);
    return response;
  });

  generateQuestion = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.generateQuestionRequest(req);
    return response;
  });
}
