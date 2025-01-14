import express from 'express';
import { Container } from 'typedi';
import AuthController from '../controllers/AuthController';

const router = express.Router();
const authController = Container.get(AuthController);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/profile', authController.profile);


export default router;
