import express from 'express';
import multer from 'multer';
import path from 'path';
import { Container } from 'typedi';
import AdminStudentController from '../controllers/AdminStudentController';
import { uploader } from '../utils/Helpers';

const router = express.Router();
const adminStudentController = Container.get(AdminStudentController);

router.get('/', adminStudentController.get);
router.post('/create', adminStudentController.createStudent);
router.put('/update', adminStudentController.updateStudent);
router.delete('/delete', adminStudentController.deleteStudent);
router.post('/invite', adminStudentController.inviteStudent);
router.post('/resend-invite', adminStudentController.resendInviteStudent);
router.post('/bulk-upload', uploader.single('file'), adminStudentController.bulkUpload);


export default router;
