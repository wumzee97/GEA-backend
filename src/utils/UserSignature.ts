import { Request } from 'express';
import jwt, { SignOptions, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import Parent, { IParent } from '../models/parents.model';
import Tutor, { ITutor } from '../models/tutors.model';
import Oauth, { IOauth } from '../models/oauth.model';
import { jwtDecode } from 'jwt-decode';
import * as Utils from '../utils';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config();

interface ExtendedRequest extends Request {
  user?: any;
}

export const ValidateSignature = async (req: Request): Promise<boolean> => {
  const signature: string | undefined = req.get('Authorization');

  console.log('signature');
  console.log(signature);

  let status = false;

  if (signature) {
    try {
      const private_key = process.env.SECRET_KEY ?? 'process.env.SECRET_KEY';
      const jwt_payload: any = await jwt.verify(signature.split(' ')[1] as string, private_key as string);
      ///
      console.log(jwt_payload);

      const checkToken = await Oauth.findOne({
        iat: jwt_payload.iat,
        exp: jwt_payload.exp,
      });

      if (!checkToken) {
        return status;
      } else {
        let user = null;

        if (checkToken.type == 'parent') {
          user = await Parent.findOne({
            email: jwt_payload.email,
          });
        } else {
          user = await Tutor.findOne({
            email: jwt_payload.email,
          });
        }

        (req as ExtendedRequest).user = user;
        status = true;
        return status;
      }
    } catch (error) {
      // Handle error here
      if (error instanceof TokenExpiredError) {
        console.error('Error: Token has expired');
      } else {
        console.error('Error:', error);
      }
      return false;
    }
  }

  return false;
};

export const SignSignature = async (userInfo: IParent) => {
  const current_time = Math.floor(Date.now() / 1000);
  const private_key = process.env.SECRET_KEY ?? 'process.env.SECRET_KEY';

  const payload = {
    user_id: userInfo.id,
    email: userInfo.email,
    type: 'parent',
  };

  const options: SignOptions = {
    expiresIn: '3h', // Token expires in 1 hour
  };

  const refreshOptions: SignOptions = {
    expiresIn: '7d', // Token expires in 1 hour
  };

  const accessToken: string = jwt.sign(payload, private_key, options);
  const refreshToken: string = jwt.sign(payload, private_key, refreshOptions);
  const decoded = jwtDecode(accessToken);

  const oauth = new Oauth({
    user_id: payload.user_id,
    email: payload.email,
    iat: decoded.iat,
    exp: decoded.exp,
    type: 'parent',
  });

  await oauth.save();

  return {
    accessToken,
    refreshToken,
    expiredAt: moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    permission: {},
  };
};

export const IssueTutorSignature = async (userInfo: ITutor) => {
  const current_time = Math.floor(Date.now() / 1000);
  const private_key = process.env.SECRET_KEY ?? 'process.env.SECRET_KEY';

  const payload = {
    user_id: userInfo.id,
    email: userInfo.email,
    type: 'tutor',
  };

  const options: SignOptions = {
    expiresIn: '3h', // Token expires in 1 hour
  };

  const refreshOptions: SignOptions = {
    expiresIn: '7d', // Token expires in 1 hour
  };

  const accessToken: string = jwt.sign(payload, private_key, options);
  const refreshToken: string = jwt.sign(payload, private_key, refreshOptions);
  const decoded = jwtDecode(accessToken);

  const oauth = new Oauth({
    user_id: payload.user_id,
    email: payload.email,
    iat: decoded.iat,
    exp: decoded.exp,
    type: 'tutor',
  });

  await oauth.save();

  return {
    accessToken,
    refreshToken,
    expiredAt: moment().add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    permission: {},
    role: 'student',
  };
};
