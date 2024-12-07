import { Service } from 'typedi';
import { Request } from 'express';
import Exam from '../models/exam.model';
import Subject from '../models/subject.model';
import Class from '../models/class.model';
import Question from '../models/question.model';
import School from '../models/school.model';
import * as Utils from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import { getPagination, getMongoPagingData } from '../utils/Pagination';
import slugify from 'slugify';

@Service()
export default class ExamModule {
  async getExamRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const { page = 1, size = 10 } = req.query; // Get page and size from request query
    const { limit, offset } = getPagination(Number(page), Number(size));

    const whereClause: any = {
      school_id: user.school_id,
      isDeleted: false,
    };

    // Get total count of documents
    const totalDocs = await Exam.countDocuments(whereClause);

    if (req.query.class_id) {
      whereClause.class_id = req.query.class_id;
    }

    const results = await Exam.find(whereClause).sort({ _id: 1 }).limit(limit).skip(offset).exec();

    // Manually fetch the class for each student
    const docs = await Promise.all(
      results.map(async (exam) => {
        const examObj = exam.toObject();
        examObj.questions_count = await Question.countDocuments({ exam_id: exam.uuid }).exec();
        examObj.responses = 0;
        return examObj;
      }),
    );

    const response = getMongoPagingData({ totalDocs, docs }, Number(page), limit);

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: response,
    });
  }

  async indexRequest(req: Request) {
    const exams = await Exam.countDocuments({
      isDeleted: false,
    });

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: {
        totalExams: exams,
        completedExams: 5,
        ongoingExams: 2,
        mostAttemptedExams: 0,
      },
    });
  }

  async viewExamRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { uuid } = req.params;

    const exam = await Exam.findOne({
      school_id: user.school_id,
      isDeleted: false,
      uuid,
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Exam was not found',
      });
    }

    const classes = await Class.findOne({
      uuid: exam.class_id,
      //deleted: 0,
      // attributes: ['id', 'uuid', 'name', 'description'],
      // order: [['id', 'DESC']],
    });

    const subject = await Subject.findOne({
      uuid: exam.subject_id,
      isDeleted: false,
    });

    const result: any = exam.toJSON();
    // Fetch questions based on the provided exam_id
    //const questions = await Question.find({ exam_id: exam.uuid }, { 'options.is_correct': 0 });
    const questions = await Question.find({ exam_id: exam.uuid });

    result.class = classes;
    result.subject = subject;
    result.questions = questions;
    result.questions_count = questions.length;
    result.responses = 0;
    // result.total_exams = 0;
    // result.completed_exams = 0;
    // result.ongoing_exams = 0;
    // result.most_attempted = "English Language";

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: result,
    });
  }

  async createExamRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const uuid: string = uuidv4();
    const { class_id, subject_id, type, category, duration, aggregate_score, minimum_pass_score, name, description } =
      req.body;

    //check subject
    //check class
    const level = await Class.findOne({
      uuid: class_id,
      //school_id: user.school_id
    });

    if (!level) {
      return new ErrorResponse({
        message: 'Class was not found',
      });
    }

    const subject = await Subject.findOne({
      uuid: subject_id,
    });

    if (!subject) {
      return new ErrorResponse({
        message: 'Subject was not found',
      });
    }

    const checkExam = await Exam.findOne({
      class_id,
      subject_id,
    });

    if (checkExam) {
      return new ErrorResponse({
        message: 'Exam for the subject has already been created for the selected class',
      });
    }

    const school = await School.findOne({
      uuid: user.school_id,
    });

    if (!school) {
      return new ErrorResponse({
        message: 'Unable to fetch school details',
      });
    }

    const exam = new Exam({
      uuid,
      school_id: user.school_id,
      slug: slugify(name.toLowerCase()),
      class_id,
      subject_id,
      type,
      category,
      duration,
      aggregate_score,
      minimum_pass_score,
      name,
      description,
      published: 0,
      status: 0,
      term: school.term,
      session: school.session
    });

    exam.uuid = exam.id;
    await exam.save();

    //exam.hasStarted = false;
    //exam.hasCompleted = false;

    return new SuccessResponse({
      message: 'Exam added successfully',
      data: exam,
    });
  }

  async updateExamRequest(req: Request) {
    const {
      uuid,
      class_id,
      subject_id,
      type,
      category,
      duration,
      aggregate_score,
      minimum_pass_score,
      name,
      description,
    } = req.body;
    const user = await Utils.currentUser(req);

    const exam = await Exam.findOne({
      uuid,
      school_id: user.school_id,
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Subject not found',
      });
    }

    const level = await Class.findOne({
      uuid: class_id,
      school_id: user.school_id,
    });

    if (!level) {
      return new ErrorResponse({
        message: 'Class was not found',
      });
    }

    const subject = await Subject.findOne({
      uuid: subject_id,
      school_id: user.school_id,
    });

    if (!subject) {
      return new ErrorResponse({
        message: 'Subject was not found',
      });
    }

    exam.class_id = class_id;
    exam.subject_id = subject_id;
    exam.type = type;
    exam.category = category;
    exam.duration = duration;
    exam.aggregate_score = aggregate_score;
    exam.minimum_pass_score = minimum_pass_score;
    exam.name = name;
    exam.description = description;
    await exam.save();

    return new SuccessResponse({
      message: 'Exam details updated successfully',
      data: exam,
    });
  }

  async publishExamRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { uuid } = req.params;

    const exam = await Exam.findOne({
      //where: {
      school_id: user.school_id,
      isDeleted: false,
      uuid,
      //},
      // include: [Class, Subject],
      //order: [['id', 'DESC']],
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Exam was not found',
      });
    }

    const count = await Question.countDocuments({ exam_id: exam.uuid });

    if (Number(exam.published) == 1) {
      exam.published = 0;
      await exam.save();

      return new SuccessResponse({
        message: 'Exam unpublished successfully',
      });
    } else {
      if (count == 0) {
        return new ErrorResponse({
          message: 'You need to upload questions before you can publish the exam',
        });
      }

      exam.published = 1;
      await exam.save();

      return new SuccessResponse({
        message: 'Exam published successfully',
      });
    }
  }

  async deleteExamRequest(req: Request) {
    const { uuid } = req.params;
    const user = await Utils.currentUser(req);

    const exam = await Exam.findOne({
      uuid,
      school_id: user.school_id,
      isDeleted: false,
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Exam not found',
      });
    }

    exam.isDeleted = true;
    await exam.save();

    return new SuccessResponse({
      message: 'Exam deleted successfully',
      data: exam,
    });
  }
}
