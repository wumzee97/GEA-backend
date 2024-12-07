import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateRolesRequest {
  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;

  @IsNotEmpty()
  @IsArray()
  permission: any[];
}

export class UpdateRolesRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;

  @IsNotEmpty()
  @IsArray()
  permission: any[];
}
