import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  deadline: string;

  @IsNumber()
  user_id: number;
}
