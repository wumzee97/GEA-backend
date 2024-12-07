import express from 'express';
import { Container } from 'typedi';
import MembersController from '../controllers/MembersController';

const router = express.Router();
const membersController = Container.get(MembersController);

router.get('/', membersController.get);
router.post('/create', membersController.createMember);
router.put('/update', membersController.updateMember);
router.delete('/:uuid', membersController.deleteMember);

export default router;
