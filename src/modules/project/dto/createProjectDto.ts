import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  deadline: string;
}
