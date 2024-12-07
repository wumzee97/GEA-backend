import { Service } from 'typedi';
import { Request } from 'express';
import * as Utils from '../utils';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import Exam from '../models/exam.model';
import Student from '../models/student.model';
import User from '../models/user.model';
import School from '../models/school.model';

@Service()
export default class AuthModule {
  async profileRequest(req: Request) {
    const user = await Utils.currentUser(req);
    return new SuccessResponse({
      message: 'User profile retrieved successfully.',
      data: await Utils.formatUser(user),
    });
  }

  async dashboardRequest(req: Request) {
    
    const user = await Utils.currentUser(req);

    const exams = await Exam.countDocuments({
      isDeleted: false,
    });
    
    const students = await Student.countDocuments({
      isDeleted: false,
    });
    
    const admins = await User.countDocuments({
      isDeleted: false,
    });

    const school = await School.findOne({
      uuid: user.school_id,
    });

    if (!school) {
      return new ErrorResponse({
        message: 'Unable to fetch school details',
      });
    }

    

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: {
        totalStudents: students,
        totalTeachers: admins,
        totalExaminations: exams,
        totalAdmins: admins,
        
        termStatus: school.term ? true : false 
      },
    });
  }
}
