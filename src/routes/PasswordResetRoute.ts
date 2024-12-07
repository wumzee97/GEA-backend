import express from 'express';
import { Container } from 'typedi';
import PasswordResetController from '../controllers/PasswordResetController';

const router = express.Router();
const passwordResetController = Container.get(PasswordResetController);

router.post('/password-reset', passwordResetController.passwordReset);
router.post('/validate-token', passwordResetController.validateToken);
router.post('/update-password', passwordResetController.updatePassword);

export default router;
