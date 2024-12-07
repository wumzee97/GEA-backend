import { Service } from 'typedi';
import { Request } from 'express';
import Subject from '../models/subject.model';
import * as Utils from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import slugify from 'slugify';

@Service()
export default class SubjectModule {
  async getSubjectRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const subjects = await Subject.find({
      school_id: user.school_id,
      isDeleted: false,
    });

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: subjects,
    });
  }

  async createSubjectRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const uuid: string = uuidv4();
    const { name, description } = req.body;

    const subject = new Subject({
      uuid,
      school_id: user.school_id,
      slug: slugify(name.toLowerCase()),
      name,
      description,
    });

    subject.uuid = subject.id;
    await subject.save();

    return new SuccessResponse({
      message: 'Subject added successfully',
      data: subject,
    });
  }

  async updateSubjectRequest(req: Request) {
    const { uuid, name, description } = req.body;
    const user = await Utils.currentUser(req);

    const subject = await Subject.findOne({
      uuid,
      school_id: user.school_id,
    });

    if (!subject) {
      return new ErrorResponse({
        message: 'Subject not found',
      });
    }

    //subject.class_id = class_id;
    subject.name = name;
    subject.description = description;
    subject.slug = slugify(name.toLowerCase());
    await subject.save();

    return new SuccessResponse({
      message: 'Subject updated successfully',
      data: subject,
    });
  }

  async deleteSubjectRequest(req: Request) {
    const { uuid } = req.params;
    const user = await Utils.currentUser(req);

    const subject = await Subject.findOne({
      uuid,
      school_id: user.school_id,
      isDeleted: false,
    });

    if (!subject) {
      return new ErrorResponse({
        message: 'Subject not found',
      });
    }

    subject.isDeleted = true;
    await subject.save();

    return new SuccessResponse({
      message: 'Subject deleted successfully',
      data: subject,
    });
  }
}
