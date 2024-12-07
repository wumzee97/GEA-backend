import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { CreateExamRequest, UpdateExamRequest } from '../requests/ExamRequest';
import { Container } from 'typedi';
import ExamController from '../controllers/ExamController';

const router = express.Router();
const examController = Container.get(ExamController);

router.get('/', examController.get);
router.get('/index', examController.index);
router.post('/publish/:uuid', examController.publishExam);
router.get('/:uuid', examController.viewExam);
router.post('/create', RequestValidator.validate(CreateExamRequest), examController.createExam);
router.put('/update', RequestValidator.validate(UpdateExamRequest), examController.updateExam);
router.delete('/:uuid', examController.deleteExam);

export default router;
