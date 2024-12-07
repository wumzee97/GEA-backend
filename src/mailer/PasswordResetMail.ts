import { processMail } from './MailService';

const sendPasswordResetMail = async (context: any) => {
  const option = {
    firstname: context.firstname,
    token: context.otp,
    title: 'Password Reset',
    subject: 'Password Reset',
    url: context.url,
    email: context.email,
  };

  await processMail('passwordreset', option);
};

export { sendPasswordResetMail };
