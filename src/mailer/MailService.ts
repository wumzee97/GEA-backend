import nodemailer, { Transporter } from 'nodemailer';
import hbs, { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';
//import { config } from 'dotenv';
import path from 'path';
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

// SendMail function
const processMail = async (template: string, options: any) => {
  // Setup handlebars options
  const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: '.hbs', // handlebars extension
      layoutsDir: path.resolve(__dirname, 'views'), // location of handlebars templates
      defaultLayout: template, // name of main template
    },
    viewPath: path.resolve(__dirname, 'views/'),
    extName: '.hbs',
  };

  // Use the handlebars plugin with the transporter
  transporter.use('compile', hbs(handlebarOptions));

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    template,
    context: options,
  };

  const info = await transporter.sendMail(message);
  console.log(info.messageId);
  return info;
};

export { processMail };
