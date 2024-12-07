import { Request } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import RolesModule from '../modules/RolesModule';

@Service()
export default class RolesController {
  constructor(public requestModule: RolesModule) {}

  get = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getRoleRequest(req);
    return response;
  });

  getPermission = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.getPermissionRequest(req);
    return response;
  });

  createRole = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.createRoleRequest(req);
    return response;
  });

  updateRole = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.updateRoleRequest(req);
    return response;
  });

  deleteRole = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.deleteRoleRequest(req);
    return response;
  });
}
