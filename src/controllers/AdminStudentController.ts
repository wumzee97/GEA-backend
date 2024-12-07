import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import AdminStudentModule from '../modules/AdminStudentModule';

@Service()
export default class AdminStudentController {
  constructor(public requestModule: AdminStudentModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getStudentRequest(req);
    return response;
  });

  createStudent = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createStudentRequest(req);
    return response;
  });

  updateStudent = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateStudentRequest(req);
    return response;
  });

  deleteStudent = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteStudentRequest(req);
    return response;
  });

  inviteStudent = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.inviteStudentRequest(req);
    return response;
  });

  resendInviteStudent = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.resendInviteStudentRequest(req);
    return response;
  });

  bulkUpload = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.bulkUploadRequest(req);
    return response;
  });

}
