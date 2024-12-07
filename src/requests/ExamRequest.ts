import { IsNotEmpty } from 'class-validator';

export class CreateExamRequest {
  @IsNotEmpty()
  class_id: string;

  @IsNotEmpty()
  subject_id: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  aggregate_score: string;

  @IsNotEmpty()
  minimum_pass_score: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}

export class UpdateExamRequest {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  class_id: string;

  @IsNotEmpty()
  subject_id: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  aggregate_score: string;

  @IsNotEmpty()
  minimum_pass_score: string;

  @IsNotEmpty()
  name: string;

  // @IsNotEmpty()
  // description: string;
}
