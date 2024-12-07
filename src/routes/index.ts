import express from 'express';
import { AuthValidator } from '../middlewares/AuthValidator';
import publicRoute from './PublicRoute';
import subscriptionRoute from './SubscriptionRoute';
import passwordResetRoute from './PasswordResetRoute';
import rolesRoute from './RolesRoute';
import authRoute from './AuthRoute';
import classRoute from './ClassRoute';
import settingsRoute from './SettingsRoute';
import subjectRoute from './SubjectRoute';
import membersRoute from './MembersRoute';
import examRoute from './ExamRoute';
import questionRoute from './QuestionRoute';
import adminStudentRoute from './AdminStudentRoute';


const router = express.Router();

const allRoutes = [
  {
    path: '/',
    route: publicRoute,
    middlewares: [],
  },
  {
    path: '/',
    route: passwordResetRoute,
    middlewares: [],
  },
  {
    path: '/subscription/',
    route: subscriptionRoute,
  },
  {
    path: '/auth/roles/',
    route: rolesRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/',
    route: authRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/class/',
    route: classRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/settings/',
    route: settingsRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/subject/',
    route: subjectRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/members/',
    route: membersRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/exam/',
    route: examRoute,
    middlewares: [AuthValidator],
  },
  {
    path: '/auth/students/',
    route: adminStudentRoute,
    middlewares: [AuthValidator],
  },


  {
    path: '/auth/questions/',
    route: questionRoute,
    middlewares: [AuthValidator],
  },
];

// Use middleware and routes
allRoutes.forEach((route) => {
  if (route.middlewares && route.middlewares.length > 0) {
    router.use(route.path, route.middlewares, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

export default router;
