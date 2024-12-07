import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { Container } from 'typedi';
import SettingsController from '../controllers/SettingsController';
import { PersonalRequest, SchoolRequest, SessionRequest, PasswordRequest } from '../requests/SettingsRequest';

const router = express.Router();
const settingsController = Container.get(SettingsController);

router.get('/personal', settingsController.personal);
router.post('/personal', RequestValidator.validate(PersonalRequest), settingsController.updatePersonal);
router.get('/school', settingsController.school);
router.post('/school', RequestValidator.validate(SchoolRequest), settingsController.updateSchool);
router.get('/billing', settingsController.billing);
router.post('/password', RequestValidator.validate(PasswordRequest), settingsController.updatePassword);
router.post('/session', RequestValidator.validate(SessionRequest), settingsController.updateSession);

export default router;
