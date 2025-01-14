import express from 'express';
import RequestValidator from '../middlewares/RequestValidator';
import { LoginRequest } from '../requests/LoginRequest';
import { RegisterRequest } from '../requests/RegisterRequest';
import { Container } from 'typedi';
import RegisterController from '../controllers/RegisterController';
import LoginController from '../controllers/LoginController';
import { uploader } from '../utils/Helpers';

const router = express.Router();
const registerController = Container.get(RegisterController);
const loginController = Container.get(LoginController);

/**
 * @swagger
 * /secure/v1/login:
 *   post:
 *     summary: Login user
 *     description: This route allows a user to log in by providing email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login response with authentication tokens and permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFqb2JpZXdlZmVtaUBnbWFpbC5jb20iLCJpYXQiOjE3MjU3Nzk4NTIsImV4cCI6MTcyNTc4MzQ1Mn0.ryNBvF1VFxBaA2DymyqlgdY8VxSKfU3XN-k7j-__puk
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFqb2JpZXdlZmVtaUBnbWFpbC5jb20iLCJpYXQiOjE3MjU3Nzk4NTIsImV4cCI6MTcyNjM4NDY1Mn0.g5m01p4BTvtI4y29C-sU8mfAO_6SUnMWCk5s0pPxNvM
 *                     expiredAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-09-08T08:22:32Z
 *                     permission:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: View Admin
 *                           value:
 *                             type: string
 *                             example: view_admin
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', registerController.blank )
router.get('/auth/google/signup', registerController.googleSignUp)
router.get('/auth/google/signup/callback', registerController.googleSignUpCallback)
router.get('/auth/google/login', registerController.googleSignIn)
router.get('/auth/google/login/callback', registerController.googleSignInCallback)
router.post('/register', registerController.register)
router.post('/register/parent/update-profile', registerController.updateParentProfile)
router.post('/register/parent/add-children', registerController.addChildren)
router.post('/login', RequestValidator.validate(LoginRequest), loginController.login);
router.post('/refresh-token', loginController.refreshToken);

//onboarding
router.post('/register', RequestValidator.validate(RegisterRequest), registerController.register);
router.post('/confirm-code', registerController.confirmCode);
router.post('/resend-code', registerController.resendCode);
router.post('/school-details', registerController.schoolDetails);

//upload endpoint
router.post('/upload-file', uploader.single('file'), registerController.uploadFile);

export default router;
