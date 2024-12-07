import nodemailer, { Transporter } from 'nodemailer';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
//import { config } from 'dotenv';
import path from 'path';
import { InviteEmailOptions } from './interface/EmailOptions';
import dotenv from 'dotenv';
dotenv.config();

//config(); // Load environment variables

// Create the transporter
const transporter: Transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

// Setup handlebars options
const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: '.hbs', // handlebars extension
    layoutsDir: path.resolve(__dirname, 'views'), // location of handlebars templates
    defaultLayout: 'invite', // name of main template
  },
  viewPath: path.resolve(__dirname, 'views/'),
  extName: '.hbs',
};

// Use the handlebars plugin with the transporter
transporter.use('compile', hbs(handlebarOptions));

// SendMail function
const sendInviteMail = async (options: InviteEmailOptions) => {
  console.log(options);
  console.log(options);
  console.log('=========================');

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: `Activate your account`,
    template: 'invite',
    context: {
      firstname: options.firstname,
      email: options.email,
      password: options.password,
      title: 'Activate your account',
      url: options.url,
    },
  };

  const info = await transporter.sendMail(message);
  console.log(info.messageId);
  return info;
};

export { sendInviteMail };
