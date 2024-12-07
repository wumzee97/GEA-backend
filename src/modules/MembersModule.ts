import { Service } from 'typedi';
import { Request } from 'express';
import User from '../models/user.model';
import Role, { IRole } from '../models/role.model';
import School from '../models/school.model';
import * as Utils from '../utils';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendInviteMail } from '../mailer/InviteMail';
import { SuccessResponse, ErrorResponse } from '../utils/Response';
import { InviteEmailOptions } from '../mailer/interface/EmailOptions';
import dotenv from 'dotenv';
dotenv.config();

const SALT: any | undefined = process.env.SALT;

@Service()
export default class MembersModule {
  async getMemberRequest(req: Request) {
    const currentUser = await Utils.currentUser(req);

    // Use .lean() to return plain JavaScript objects
    const users = await User.find({
      school_id: currentUser.school_id,
      isDeleted: 0,
    }).lean(); // Add .lean() to get plain objects

    // Fetch and assign roles asynchronously
    const parsedUsers = await Promise.all(
      users.map(async (user) => {
        const role = await Role.findOne({ uuid: user.role_id }).lean<IRole>(); // Get role as plain object
        console.log('===============');
        console.log(role);

        // Assign the role to the user
        if (role) {
          user.role = role; // Assign role to user object
        }

        return user; // Return modified user object
      }),
    );

    return new SuccessResponse({
      message: 'Data fetched successfully',
      data: parsedUsers,
    });
  }

  async createMemberRequest(req: Request) {
    const user = await Utils.currentUser(req);
    const uuid: string = uuidv4();
    const { firstname, lastname, email, role, avatar } = req.body;
    const password = await Utils.generateRandomString(7);
    const hash = bcrypt.hashSync(password, parseInt(SALT, 10) || 10);

    const roles = await Role.findOne({
      uuid: role,
    });

    if (!roles) {
      return new ErrorResponse({
        message: 'Role was not found',
      });
    }

    const checkMember = await User.findOne({
      //where: {
      school_id: user.school_id,
      email,
      //}
    });

    if (checkMember) {
      return new ErrorResponse({
        message: 'Email already exist',
      });
    }

    const member = new User({
      uuid,
      school_id: user.school_id,
      firstname,
      lastname,
      email,
      role_id: role,
      avatar,
      password: hash,
      status: 'pending',
      invited_by: '',
    });

    const school = await School.findOne({
      uuid: user.school_id,
    });

    member.uuid = member.id;
    await member.save();

    //send email to member
    //try {

    const message: InviteEmailOptions = {
      firstname,
      email,
      password,
      url: `${school?.sub_domain}`,
    };

    // Dispatch email
    await sendInviteMail(message);

    // }catch(error) {
    //     console.error('Error sending activation mail:', error);
    // }

    return new SuccessResponse({
      message: 'Member added successfully',
    });
  }

  async updateMemberRequest(req: Request) {
    const { uuid, firstname, lastname, email, role, avatar } = req.body;
    const user = await Utils.currentUser(req);

    const member = await User.findOne({
      //where: {
      uuid,
      school_id: user.school_id,
      //},
    });

    if (!member) {
      return new ErrorResponse({
        message: 'Member not found',
      });
    }

    const roles = await Role.findOne({
      uuid: role,
    });

    if (!roles) {
      return new ErrorResponse({
        message: 'Role was not found',
      });
    }

    member.firstname = firstname;
    member.lastname = lastname;
    member.role_id = role;
    member.avatar = avatar;
    //member.email = email;

    await member.save();

    return new SuccessResponse({
      message: 'Member updated successfully',
    });
  }

  async deleteMemberRequest(req: Request) {
    const { uuid } = req.params;
    const user = await Utils.currentUser(req);

    const member = await User.findOne({
      uuid,
      school_id: user.school_id,
      isDeleted: false,
    });

    if (!member) {
      return new ErrorResponse({
        message: 'Member not found',
      });
    }

    member.isDeleted = true;
    await member.save();

    return new SuccessResponse({
      message: 'Member deleted successfully',
    });
  }
}
