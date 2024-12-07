import { Service } from 'typedi';
import { Request } from 'express';
import mongoose, { Types } from 'mongoose';
import Class from '../models/class.model';
import Student from '../models/student.model';
import * as Utils from '../utils';
import { SuccessResponse, ErrorResponse } from '../utils/Response';

@Service()
export default class ClassModule {
  async getClassRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const whereClause: any = {
      school_id: user.school_id,
      deleted: 0,
    };

    const classes = await Class.find(whereClause);

    const formattedClasses = await Promise.all(
      classes.map(async (element) => {
  
        const classObj = element.toObject();
  
        // Assuming 'value' is a JSON string that needs to be parsed
        const totalDocs = await Student.countDocuments({
          class_id: element._id
        });
  
        classObj.numberOfStudent = totalDocs;
        return classObj;
      })
    );

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: formattedClasses,
    });
  }

  async createClassRequest(req: Request) {
    const user = await Utils.currentUser(req);
    //const uuid: string = uuidv4();

    const { name, description } = req.body;

    const category = new Class({
      //uuid,
      school_id: user.school_id,
      name,
      description,
    });

    // Make sure _id is properly typed
    category.uuid = (category._id as mongoose.Types.ObjectId).toString();

    await category.save();

    return new SuccessResponse({
      message: 'Class added successfully',
      data: category,
    });
  }

  async updateClassRequest(req: Request) {
    const { uuid, name, description } = req.body;
    const user = await Utils.currentUser(req);

    const category = await Class.findOne({
      uuid,
      school_id: user.school_id,
    });

    if (!category) {
      return new ErrorResponse({
        message: 'Class not found',
      });
    }

    // Ensure the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(uuid)) {
      return new ErrorResponse({
        messaxge: 'Invalid class ID',
      });
    }

    category.name = name;
    category.description = description;
    await category.save();

    const data = {
      name: name,
      description: description,
    };

    return new SuccessResponse({
      message: 'Class updated successfully',
      data: category,
    });
  }

  async deleteClassRequest(req: Request) {
    const { uuid } = req.params;
    const user = await Utils.currentUser(req);

    const category = await Class.findOne({
      uuid,
      school_id: user.school_id,
    });

    if (!category) {
      return new ErrorResponse({
        message: 'Class not found',
      });
    }

    category.deleted = 1;
    await category.save();

    return new SuccessResponse({
      message: 'Class deleted successfully',
      data: category,
    });
  }
}
