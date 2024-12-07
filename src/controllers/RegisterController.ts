// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper';
import { Service } from 'typedi';
import RegisterModule from '../modules/RegisterModule';
import passport from 'passport';

@Service()
export default class RegisterController {
  constructor(public requestModule: RegisterModule) {}

  googleSignUp = (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;

    if (!type || (type !== 'parent' && type !== 'tutor')) {
      console.log('Invalid or missing user type:', type);
      return res.status(400).send('Invalid or missing user type');
    }

    console.log('Initiating Google OAuth with type:', type);

    passport.authenticate('google-signup', {
      scope: ['profile', 'email'],
      state: type as string, // Pass type to the callback
    })(req, res, next);
  };

  googleSignIn = (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;

    if (!type || (type !== 'parent' && type !== 'tutor')) {
      console.log('Invalid or missing user type:', type);
      return res.status(400).send('Invalid or missing user type');
    }

    console.log('Initiating Google OAuth with type:', type);

    passport.authenticate('google-login', {
      scope: ['profile', 'email'],
      state: type as string, // Pass type to the callback
    })(req, res, next);
  };

  googleSignUpCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google-signup', { failureRedirect: '/' }, (err, user, info) => {
      const frontendUrl = process.env.FRONTEND_URL;
      if (err) {
        console.error('Error during authentication:', err);
        return next(err); // Pass error to the error-handling middleware
      }

      if (!user) {
        return res.redirect(`${frontendUrl}/auth/create-account/parent?error=Email already in use, login instead!`); // Redirect to the failure page if authentication fails
      }

      // Log the authenticated user for debugging
      console.log('Authenticated user:', user);

      res.redirect(
        `${frontendUrl}/auth/create-profile/parent?fn=${btoa(user.firstName)}&ln=${btoa(user.lastName)}&account_id=${
          user.token
        }`,
      );
    })(req, res, next); // Important: Pass the original req, res, next to authenticate
  };

  googleSignInCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google-login', { failureRedirect: '/' }, (err, user, info,refresh) => {
      const frontendUrl = process.env.FRONTEND_URL;
      if (err) {
        console.error('Error during authentication:', err);
        return next(err); // Pass error to the error-handling middleware
      }

      if (!user) {
        return res.redirect(`${frontendUrl}/auth/login/${info.type}?error=No account associated with the email!`); // Redirect to the failure page if authentication fails
      }

      // Log the authenticated user for debugging
      console.log('Authenticated user:', user);

      res.redirect(`${frontendUrl}/auth/login/${user.type}?dn=${btoa(info)}&fm=${btoa(refresh)}`);
    })(req, res, next); // Important: Pass the original req, res, next to authenticate
  };

  register = asyncWrapper(async (req: Request) => {
    const { email, password } = req.body;
    const response = await this.requestModule.registerRequest(email, password);
    return response;
  });

  updateParentProfile = asyncWrapper(async (req: Request) => {
    const { firstName, lastName, phoneNumber, country, account_id } = req.body;
    const response = await this.requestModule.updateParentProfile(
      firstName,
      lastName,
      phoneNumber,
      country,
      account_id,
    );
    return response;
  });

  addChildren = asyncWrapper(async (req: Request) => {
    const { account_id, children } = req.body;
    const response = await this.requestModule.addChildren(account_id, children);
    return response;
  });

  confirmCode = asyncWrapper(async (req: Request) => {
    const { account_id, code } = req.body;
    const response = await this.requestModule.confirmCodeRequest(account_id, code);
    return response;
  });

  resendCode = asyncWrapper(async (req: Request) => {
    const { account_id } = req.body;
    const response = await this.requestModule.resendCodeRequest(account_id);
    return response;
  });

  schoolDetails = asyncWrapper(async (req: Request) => {
    const { account_id, school_name, website, sub_domain, phone, country, state, address } = req.body;
    const response = await this.requestModule.schoolDetailRequest(
      account_id,
      school_name,
      website,
      sub_domain,
      phone,
      country,
      state,
      address,
    );
    return response;
  });

  uploadFile = asyncWrapper(async (req: Request) => {
    const response = await this.requestModule.uploadFileRequest(req);
    return response;
  });
}
