// Interface for email options
interface EmailOptions {
  firstname: string;
  email: string;
  otp: string;
  url?: string;
}

interface InviteEmailOptions {
  firstname: string;
  email: string;
  password: string;
  url: string;
}

export { EmailOptions, InviteEmailOptions };
