import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { CreateSubjectRequest, UpdateSubjectRequest } from '../requests/SubjectRequest';
import { Container } from 'typedi';
import SubjectController from '../controllers/SubjectController';

const router = express.Router();
const subjectController = Container.get(SubjectController);

router.get('/', subjectController.get);
router.post('/create', RequestValidator.validate(CreateSubjectRequest), subjectController.createSubject);
router.put('/update', RequestValidator.validate(UpdateSubjectRequest), subjectController.updateSubject);
router.delete('/:uuid', subjectController.deleteSubject);

export default router;
