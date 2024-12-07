import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { CreateRolesRequest, UpdateRolesRequest } from '../requests/RolesRequest';
import { Container } from 'typedi';
import RolesController from '../controllers/RolesController';

const router = express.Router();
const rolesController = Container.get(RolesController);

router.get('/', rolesController.get);
router.get('/permissions', rolesController.getPermission);
router.post('/create', RequestValidator.validate(CreateRolesRequest), rolesController.createRole);
router.put('/update', RequestValidator.validate(UpdateRolesRequest), rolesController.updateRole);
router.delete('/:uuid', rolesController.deleteRole);

export default router;
