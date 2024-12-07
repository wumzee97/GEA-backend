import { IsNotEmpty } from 'class-validator';

export class CreateClassRequest {
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}

export class UpdateClassRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}
