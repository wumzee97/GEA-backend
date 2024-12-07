// @ts-nocheck
import { processMail } from './MailService';

const sendActivationMail = async (context: any) => {
  const option = {
    firstname: context.firstname,
    token: context.otp,
    title: 'Activate your account',
    subject: 'Activate your account',
    email: context.email,
  };

  await processMail('activation', option);
};

export { sendActivationMail };
