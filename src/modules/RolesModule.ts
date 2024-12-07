import { Service } from 'typedi';
import { Request } from 'express';
import Role from '../models/role.model';
import * as Utils from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import slugify from 'slugify';

@Service()
export default class RolesModule {
  async getRoleRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const roles = await Role.find({
      school_id: user.school_id,
      isDeleted: false,
    });

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: roles,
    });
  }

  async getPermissionRequest(req: Request) {
    const settingsPermission = [
      { name: 'View Admins', value: 'view_admins' },
      { name: 'Create Admin', value: 'create_admin' },
      { name: 'Edit Admin', value: 'edit_admin' },
      { name: 'Delete Admin', value: 'delete_admin' },
      { name: 'View Exams', value: 'view_exams' },
      { name: 'View Exam Analytics', value: 'view_exam_analytics' },
      { name: 'Create Exams', value: 'create_exams' },
      { name: 'Edit Exams', value: 'edit_exams' },
      { name: 'Delete Exams', value: 'delete_exams' },
      { name: 'Grade Exams', value: 'grade_exams' },
      { name: 'Publish Exams', value: 'publish_exams' },
      { name: 'View Subject', value: 'view_subject' },
      { name: 'Create Subject', value: 'create_subject' },
      { name: 'Edit Subject', value: 'edit_subject' },
      { name: 'Delete Subject', value: 'delete_subject' },
      { name: 'View Class', value: 'view_class' },
      { name: 'Create Class', value: 'create_class' },
      { name: 'Edit Class', value: 'edit_class' },
      { name: 'Delete Class', value: 'delete_class' },
      { name: 'View Roles', value: 'view_roles' },
      { name: 'Create Roles', value: 'create_roles' },
      { name: 'Edit Roles', value: 'edit_roles' },
      { name: 'Delete Roles', value: 'delete_roles' },
      { name: 'View Billing', value: 'view_billing' },
      { name: 'Edit Billing', value: 'edit_billing' },
      { name: 'Delete Billing', value: 'delete_billing' },
      { name: 'View Activity Logs', value: 'view_activity_logs' },
      { name: 'View Dashboard Analytics', value: 'view_dashboard_analytics' },
      { name: 'View Results', value: 'view_results' },
      { name: 'View Responses', value: 'view_responses' },
    ];

    if (!settingsPermission) {
      return new SuccessResponse({
        message: 'Data fetched successfully',
        data: [],
      });
    }

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: settingsPermission,
    });
  }

  async createRoleRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const uuid: string = uuidv4();
    const { name, description, permission } = req.body;

    const roles = new Role({
      uuid,
      school_id: user.school_id,
      slug: slugify(name.toLowerCase()),
      name,
      description,
      permission: permission,
    });

    roles.uuid = roles.id;
    await roles.save();

    return new SuccessResponse({
      message: 'Roles added successfully',
    });
  }

  async updateRoleRequest(req: Request) {
    const { uuid, name, description, permission } = req.body;
    const user = await Utils.currentUser(req);

    const roles = await Role.findOne({
      uuid,
      school_id: user.school_id,
    });

    if (!roles) {
      return new ErrorResponse({
        message: 'Role not found',
      });
    }

    roles.name = name;
    roles.description = description;
    roles.slug = slugify(name.toLowerCase());
    roles.permission = permission;
    await roles.save();

    return new SuccessResponse({
      message: 'Roles updated successfully',
    });
  }

  async deleteRoleRequest(req: Request) {
    const { uuid } = req.params;
    const user = await Utils.currentUser(req);

    const roles = await Role.findOne({
      uuid,
      school_id: user.school_id,
      isDeleted: false,
    });

    if (!roles) {
      return new ErrorResponse({
        message: 'Role not found',
      });
    }

    roles.isDeleted = true;
    await roles.save();

    return new SuccessResponse({
      message: 'Roles deleted successfully',
    });
  }
}
