import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { CreateClassRequest, UpdateClassRequest } from '../requests/ClassRequest';
import { Container } from 'typedi';
import ClassController from '../controllers/ClassController';

const router = express.Router();
const classController = Container.get(ClassController);

router.get('/', classController.get);
router.post('/create', RequestValidator.validate(CreateClassRequest), classController.createClass);
router.put('/update', RequestValidator.validate(UpdateClassRequest), classController.updateClass);
router.delete('/:uuid', classController.deleteClass);

export default router;
