import { IsNotEmpty } from 'class-validator';

export class CreateStudentRequest {
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}

export class UpdateStudentRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}
