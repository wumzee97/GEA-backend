import { ValidateSignature } from '../utils/UserSignature';
import { Request, Response, NextFunction } from 'express';

export const AuthValidator = async (req: Request, res: Response, next: NextFunction) => {
  console.log('got here');

  const isAuthorized = await ValidateSignature(req);

  if (isAuthorized) {
    return next();
  }

  return res.status(401).send({
    error: false,
    message: 'Not Authorized',
  });
};

// Function to set needed header auth
export function checkRole(roles?: string[]): (req: Request, _res: Response, next: NextFunction) => void {
  return function (req: Request, _res: Response, next: NextFunction): void {
    try {
      // const validRoles: string[] = roles ? roles : [config.roleTypes.normal]
      // const user: UserAuth = req.user
      // if (!user || !validRoles.includes(user.role)) //throw Errors.Unauthorized(MESSAGES.UNAUTHORIZED)
      next();
    } catch (error) {
      //logger.error('Check Role Error: ', error)
      next(error);
    }
  };
}
