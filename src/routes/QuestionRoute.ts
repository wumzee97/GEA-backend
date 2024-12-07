import express from 'express';
import multer from 'multer';
import path from 'path';
import RequestValidator from '../middlewares/RequestValidator';
import { CreateExamRequest, UpdateExamRequest } from '../requests/ExamRequest';
import { Container } from 'typedi';
import QuestionController from '../controllers/QuestionController';
import { uploader } from '../utils/Helpers';

const router = express.Router();
const questionController = Container.get(QuestionController);

//questions
router.post('/create', questionController.createQuestions);
router.post('/bulk-delete', questionController.bulkQuestionDelete);
router.put('/update', questionController.updateQuestion);
router.post('/mark', questionController.markTheoryQuestion);
router.post('/bulk-upload/:exam_id', uploader.single('file'), questionController.bulkUpload);
router.post('/bulk-upload-theory/:exam_id', uploader.single('file'), questionController.bulkUploadTheory);

//use open ai
router.post('/generate', questionController.generateQuestion);

export default router;
