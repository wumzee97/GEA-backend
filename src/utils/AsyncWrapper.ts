import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from './Response';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncWrapper = (handler: AsyncFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response: SuccessResponse = await handler(req, res, next);
    res.status(response.statusCode).send(response.data);
  } catch (err) {
    next(err);
  }
};
