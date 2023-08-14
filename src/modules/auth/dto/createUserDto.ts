import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
