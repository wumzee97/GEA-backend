import { IsNotEmpty } from 'class-validator';

export class CreateSubjectRequest {
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}

export class UpdateSubjectRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}
