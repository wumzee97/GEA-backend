import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  role: string;
}

export class UpdateUserRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  role: string;
}
