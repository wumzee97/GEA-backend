import { IsNotEmpty } from 'class-validator';

export class PersonalRequest {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;
}

export class SchoolRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  website: string;

  @IsNotEmpty()
  sub_domain: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  logo: string;
}


export class SessionRequest {
  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  term: string;
}

export class PasswordRequest {
  @IsNotEmpty()
  current_password: string;

  @IsNotEmpty()
  new_password: string;
}