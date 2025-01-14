import express from 'express';
import { AuthValidator } from '../middlewares/AuthValidator';
import publicRoute from './PublicRoute';

import passwordResetRoute from './PasswordResetRoute';

import authRoute from './AuthRoute';

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
    path: '/auth/',
    route: authRoute,
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
