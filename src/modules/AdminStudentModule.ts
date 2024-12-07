import { Service } from 'typedi';
import { Request } from 'express';
import XLSX from 'xlsx';
import * as fs from 'fs';
import School from '../models/school.model';
import Student from '../models/student.model';
import Class from '../models/class.model';
import * as Utils from '../utils';
import bcrypt from 'bcrypt';
import { sendInviteStudent } from '../mailer/InviteStudent';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import { Types } from 'mongoose';
import { getPagination, getMongoPagingData } from '../utils/Pagination';

const SALT: any | undefined = process.env.SALT;

type Student = {
  class_id: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  school_id?: string; // Optional at first, but added later
};

@Service()
export default class StudentModule {

  async getStudentRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const { page = 1, size = 10 } = req.query; // Get page and size from request query
    const { limit, offset } = getPagination(Number(page), Number(size));

    const whereClause: any = {
      school_id: user.school_id,
      isDeleted: false,
    };

    // Get total count of documents
    const totalDocs = await Student.countDocuments(whereClause);

    if (req.query.class_id) {
      whereClause.class_id = req.query.class_id;
    }

    if (req.query.gender) {
      whereClause.gender = req.query.gender;
    }

    console.log(whereClause);

    const docs = await Student.find(whereClause)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(offset)
      .populate('class_id') // This will fetch the class details based on class_id
      .exec();

    const response = getMongoPagingData({ totalDocs, docs }, Number(page), limit);

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: response,
    });
  }

  async createStudentRequest(req: Request) {
    const user = await Utils.currentUser(req);
    //const uuid: string = uuidv4();
    const { class_id, firstname, lastname, email, gender, picture } = req.body;
    const password = await Utils.generateRandomString(7);
    const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);

    const classess = await Class.findOne({
      uuid: class_id,
      //school_id: user.school_id
    });

    if (!classess) {
      return new ErrorResponse({
        message: 'Class_id was not found',
      });
    }

    const checkStudent = await Student.findOne({ email: email });

    if (checkStudent) {
      return new ErrorResponse({
        message: 'Email already exist',
      });
    }

    const newStudent = new Student({
      school_id: user.school_id,
      class_id,
      firstname,
      lastname,
      email,
      gender,
      picture,
      status: 0,
    });

    await newStudent.save();

    const school = await School.findOne({
      uuid: user.school_id,
    });

    //send email to member
    try {
      const message: any = {
        id: newStudent.id,
        firstname,
        email,
        password,
        url: `${school?.sub_domain}`,
      };

      // Dispatch email
      await sendInviteStudent(message);
    } catch (error) {
      console.error('Error sending activation mail:', error);
    }

    return new SuccessResponse({
      message: 'Student added successfully',
    });
  }

  async updateStudentRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { id, class_id, firstname, lastname, email, gender, picture } = req.body;
    //const password = await Utils.generateRandomString(7);
    //const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);

    const classess = await Class.findOne({
      uuid: class_id,
      //school_id: user.school_id
    });

    if (!classess) {
      return new ErrorResponse({
        message: 'Class_id was not found',
      });
    }

    // Ensure the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return new ErrorResponse({
        message: 'Invalid question ID',
      });
    }

    const data = {
      class_id,
      firstname,
      lastname,
      email,
      gender,
      picture,
    };

    // Find the question by ID and update it with the new data
    const updatedQuestion = await Student.findByIdAndUpdate(id, data, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // If the question is not found, return an error
    if (!updatedQuestion) {
      return new ErrorResponse({
        message: 'Student not found',
      });
    }

    return new SuccessResponse({
      message: 'Student updated successfully',
    });
  }

  async deleteStudentRequest(req: Request) {
    const { data } = req.body;
    const user = await Utils.currentUser(req);

    // Convert the provided question ids (data) to ObjectId if necessary
    const studentIds = data.map((id: string) => new Types.ObjectId(id));

    console.log(studentIds);

    const result: any = await Student.updateMany(
      { _id: { $in: studentIds }, isDeleted: false }, // Match students by IDs and only those not already soft-deleted
      { $set: { isDeleted: true } }, // Set isDeleted to true
      { multi: true }, // Apply to multiple documents
    );

    console.log(result);

    if (result.modifiedCount > 0) {
      return new SuccessResponse({
        message: `${result.modifiedCount} students deleted successfully.`,
      });
    }

    return new ErrorResponse({
      message: 'Unable to delete Student(s), Kindly try again.',
    });
  }

  async resendInviteStudentRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { email } = req.body;
    const checkStudent = await Student.findOne({ email: email });

    console.log(checkStudent);

    if (!checkStudent) {
      return new ErrorResponse({
        message: 'Email does not exist',
      });
    }

    if (checkStudent.status === 1) {
      return new ErrorResponse({
        message: 'Account has already been activated',
      });
    }

    // Fetch the school using the user's school_id
    const school = await School.findOne({
      uuid: user.school_id,
    });

    // Send email invitation
    try {
      const inviteMessage = {
        email: email,
        url: `${school?.sub_domain}.quizzey.com/student/activate-account/${checkStudent.id}?email=${email}`,
      };

      // Dispatch email (Assuming sendInviteStudent handles async properly)
      await sendInviteStudent(inviteMessage);
    } catch (error) {
      console.error(`Error sending invite to ${email}:`, error);
    }

    return new SuccessResponse({
      message: `Invite sent to student successfully.`,
    });
  }

  async inviteStudentRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { class_id, email } = req.body;
    const studentsToInvite = [];

    // Fetch the school using the user's school_id
    const school = await School.findOne({
      uuid: user.school_id,
    });

    // Loop through each email in the email array
    for (const studentEmail of email) {
      // Check if the student already exists in the database
      const existingStudent = await Student.findOne({ email: studentEmail });

      if (!existingStudent) {
        // Add student details to the invite array
        studentsToInvite.push({
          school_id: user.school_id,
          class_id: class_id,
          email: studentEmail,
        });

        // Send email invitation
        //try {
        const inviteMessage = {
          email: studentEmail,
          url: `${school?.sub_domain}.quizzey.com/activate-account/${existingStudent!.id}?email=${studentEmail}`,
        };

        // Dispatch email (Assuming sendInviteStudent handles async properly)
        await sendInviteStudent(inviteMessage);
        // } catch (error) {
        //   console.error(`Error sending invite to ${studentEmail}:`, error);
        // }
      }
    }

    // Insert all new students into the database
    if (studentsToInvite.length > 0) {
      try {
        await Student.insertMany(studentsToInvite);
        return new SuccessResponse({
          message: 'Student(s) invited successfully',
        });
      } catch (error) {
        console.error('Error inserting students:', error);
        return new ErrorResponse({
          message: 'Unable to invite student(s). Kindly try again.',
        });
      }
    } else {
      return new ErrorResponse({
        message: 'No new students to invite.',
      });
    }
  }

  async bulkUploadRequest(req: Request) {

    const user = await Utils.currentUser(req);

    // Check if file is uploaded
    if (!req.file) {
      return new ErrorResponse({
        message: 'No file uploaded',
      });
    }

    // Get the file path
    const filePath = req.file.path;

    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);

      // Assuming the data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON format and cast as Student[]
      const students = XLSX.utils.sheet_to_json(sheet) as unknown as Student[];

      // Create a set to track unique emails
      const emailSet = new Set<string>();

      // Iterate over the students array to validate class_id
      for (const student of students) {

        // Check if class_id exists in the Class table
        const classExists = await Class.findOne({ uuid: student.class_id });

        if (!classExists) {
          return new ErrorResponse({
            message: `Class ID ${student.class_id} does not exist`,
          });
        }

        // Check if class_id exists in the Class table
        const emailExists = await Student.findOne({ email: student.email, school_id: user.school_id });

        if (!emailExists) {
          return new ErrorResponse({
            message: `Class ID ${student.class_id} does not exist`,
          });
        }

        // Check if the email already exists in the set (duplicate)
        if (emailSet.has(student.email)) {
          return new ErrorResponse({
            message: `Duplicate email found: ${student.email}`,
          });
        } else {
          // Add the email to the set
          emailSet.add(student.email);
        }
      }

      // Add 'school_id' to each student record
      const studentsWithSchoolId = students.map((student: any) => ({
        ...student,
        school_id: user.school_id,
      }));

      // Insert all the students into the database
      await Student.insertMany(studentsWithSchoolId);

      return new SuccessResponse({
        message: 'Students saved successfully.',
      });

    } catch (error) {
      return new ErrorResponse({
        message: 'Error reading file',
        error,
      });

    } finally {
      // Delete the file after reading its contents
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File successfully deleted.');
        }
      });
    }
  }

}
