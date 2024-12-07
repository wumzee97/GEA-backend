import { Service } from 'typedi';
import { Request } from 'express';
import School from '../models/school.model';
import Subscription from '../models/subscription.model';
import bcrypt from 'bcrypt';
import * as Utils from '../utils';
import { SuccessResponse, ErrorResponse } from '../utils/Response';

const SALT: any | null = process.env.SALT;

@Service()
export default class SettingsModule {
  async personalRequest(req: Request) {
    const user = await Utils.currentUser(req);

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: {
        account_id: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone ?? '',
        email: user.email,
        avatar: user.avatar ?? '',
      },
    });
  }

  async schoolRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const school = await School.findOne({
      uuid: user.school_id,
    });

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: {
        uuid: school?.uuid,
        name: school?.name,
        website: school?.website,
        sub_domain: school?.sub_domain,
        country: school?.country,
        state: school?.state,
        address: school?.address,
        logo: school?.logo ?? '',
        term: school?.term,
        session: school?.session
      },
    });
  }

  async billingRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const subscription = await Subscription.findOne({
      //where: {
      school_id: user.school_id,
      ///},
      //order: [['id', 'DESC']],
    });

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: subscription,
    });
  }

  async updatePasswordRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { current_password, new_password } = req.body;
    const isPasswordCorrect = bcrypt.compareSync(current_password, user.password);

    if (isPasswordCorrect) {
      user.password = bcrypt.hashSync(new_password, parseInt(SALT, 10) || 10);
      await user.save();

      return new SuccessResponse({
        message: 'Password updated successfully',
      });
    }

    return new ErrorResponse({
      message: 'The provided current password is incorrect.',
    });
  }

  async updatePersonalRequest(req: Request) {
    const user = await Utils.currentUser(req);

    const school = await School.findOne({
      uuid: user.school_id,
    });

    const { firstname, lastname, phone, avatar } = req.body;

    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    //user.email = email;
    user.avatar = avatar;
    await user.save();

    return new SuccessResponse({
      message: 'Data updated successfully',
    });
  }

  async updateSchoolRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { name, website, sub_domain, country, state, address, logo } = req.body;

    const school = await School.findOne({
      uuid: user.school_id,
    });

    if (!school) {
      return new ErrorResponse({
        message: 'Unable to fetch school details',
      });
    }

    school.name = name;
    school.website = website;
    school.sub_domain = sub_domain;
    school.country = country;
    school.state = state;
    school.address = address;
    school.logo = logo;
    await school.save();

    return new SuccessResponse({
      message: 'Data updated successfully',
    });
  }

  async updateSessionRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const { term, session } = req.body;

    const school = await School.findOne({
      uuid: user.school_id,
    });

    if (!school) {
      return new ErrorResponse({
        message: 'Unable to fetch school details',
      });
    }

    school.term = term;
    school.session = session;
    await school.save();

    return new SuccessResponse({
      message: 'Data updated successfully',
      data: school
    });
  }
}
