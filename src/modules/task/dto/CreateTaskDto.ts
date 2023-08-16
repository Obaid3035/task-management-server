import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  deadline: string;
  @IsString()
  status: string;
  priority: string;
  @IsArray()
  users: number[]
}
