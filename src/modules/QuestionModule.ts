import { Service } from 'typedi';
import { Request } from 'express';
import XLSX from 'xlsx';
import * as fs from 'fs';
import Exam from '../models/exam.model';
import Question from '../models/question.model';
import Answer from '../models/question.model';
import * as Utils from '../utils';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import { Types } from 'mongoose';
import OpenAI from "openai";
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from '../services/S3Client';

@Service()
export default class ExamModule {
  
  async createQuestionsRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { data } = req.body;

    const exam = await Exam.findOne({
      school_id: user.school_id,
      isDeleted: false,
      uuid: data[0].exam_id,
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Exam was not found',
      });
    }

    if (data.length > 1) {
      await Question.insertMany(data);
      return new SuccessResponse({
        message: 'Question(s) saved successfully.',
      });
    } else {
      const newQuestion = new Question(data[0]);
      await newQuestion.save();

      return new SuccessResponse({
        message: 'Question saved successfully.',
      });
    }
  }

  async bulkQuestionDeleteRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { data, exam_id } = req.body;

    const exam = await Exam.findOne({
      school_id: user.school_id,
      isDeleted: false,
      uuid: exam_id,
    });

    if (!exam) {
      return new ErrorResponse({
        message: 'Exam was not found',
      });
    }

    // Convert the provided question ids (data) to ObjectId if necessary
    const objectIds = data.map((id: string) => new Types.ObjectId(id));

    // Bulk delete the questions whose _id matches the ids in the array
    const result = await Question.deleteMany({ _id: { $in: objectIds } });

    if (result.deletedCount > 0) {
      return new SuccessResponse({
        message: 'Question(s) deleted successfully',
      });
    }

    return new ErrorResponse({
      message: 'Unable to delete Question(s), Kindly try again.',
    });
  }

  async updateQuestionRequest(req: Request) {
    const { question_id, data } = req.body; // Question ID from request parameters

    // Ensure the ID is a valid ObjectId
    if (!Types.ObjectId.isValid(question_id)) {
      return new ErrorResponse({
        message: 'Invalid question ID',
      });
    }

    // Find the question by ID and update it with the new data
    const updatedQuestion = await Question.findByIdAndUpdate(question_id, data, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // If the question is not found, return an error
    if (!updatedQuestion) {
      return new ErrorResponse({
        message: 'Question not found',
      });
    }

    // Return a success response with the updated question
    return new SuccessResponse({
      message: 'Question updated successfully',
      data: updatedQuestion,
    });
  }

  async markTheoryQuestionRequest(req: Request) {

    const { question_id, mark } = req.body; // Question ID from request parameters

    const question = await Answer.findOne({
      id: question_id
    });

    if(question){
      
      question.mark = mark;
      question.save();

      return new SuccessResponse({
        message: 'Question marked successfully'
      });

    }

    return new ErrorResponse({
      message: 'Invalid Question'
    });

  }

  async bulkUploadRequest(req: Request) {

    const user = await Utils.currentUser(req);
    const { exam_id } = req.params;

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
      const questions = XLSX.utils.sheet_to_json(sheet) as any;

      if(await Utils.checkQuestionKeyExists(questions[0])){
        return new ErrorResponse({
          message: 'Invalid file header'
        });
      }

      const newArray = Array();

      // Iterate over the students array to validate class_id
      for (const question of questions) {

          const answer = question['Correct Answer'];
          
          newArray.push({
            exam_id: exam_id,
            type: question['Question Type'],
            question_text: question['Question Text'],
            question_image: "",
            answerType: question['Answer Type'],
            options: [
              {
                "text": question['Option A'],
                "image": "",
                //"_id": uuidv4(),
                "is_correct": answer.includes('A') ? true : false
              },
              {
                "text": question['Option B'],
                "image": "",
                //"_id": uuidv4(),
                "is_correct": answer.includes('B') ? true : false
              },
              {
                "text": question['Option C'],
                "image": "",
                //"_id": uuidv4(),
                "is_correct": answer.includes('C') ? true : false
              },
              {
                "text": question['Option D'],
                "image": "",
                //"_id": uuidv4(),
                "is_correct": answer.includes('D') ? true : false
              }
            ]
          })
      }

      // Insert all the students into the database
      await Question.insertMany(newArray);

      return new SuccessResponse({
        message: 'Questions uploaded successfully.',
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

  async bulkUploadTheory(req: Request) {

    const user = await Utils.currentUser(req);
    const { exam_id } = req.params;

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
      const questions = XLSX.utils.sheet_to_json(sheet) as any;

      if(await Utils.checkTheoryKeyExists(questions[0])){
        return new ErrorResponse({
          message: 'Invalid file header'
        });
      }

      const newArray = Array();

      // Iterate over the students array to validate class_id
      for (const question of questions) {
          
          newArray.push({
            exam_id: exam_id,
            type: question['Question Type'],
            question_text: question['Question Text'],
            question_image: "",
            answerType: "",  //question['Answer Type'],
          })
      }

      // Insert all the students into the database
      await Question.insertMany(newArray);

      return new SuccessResponse({
        message: 'Questions uploaded successfully.',
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

  async generateQuestionRequest(req: Request) {

    const client = new OpenAI({
      apiKey: "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", 
      organization: "org-Ih5ZLd36do6yk76sIt6giOdk",
      //project: "org-BxEt3NnQVn96jrn4y0Ay1Olv",
    });

    //console.log(client);

    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo'
    });
  
    // console.log(response._request_id);

    return new ErrorResponse({
      message: 'Invalid Question',
      //data: response._request
    });

  }

}
