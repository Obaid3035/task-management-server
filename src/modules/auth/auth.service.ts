import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { createUserDto } from "./dto/createUserDto";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { PostgrestError } from "@supabase/supabase-js";
import { LoginUserDto } from "./dto/loginUserDto";

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService
  ) {
  }

  async register(newUser: createUserDto): Promise<string> {
    console.log("********** Registering user ***********");
    const { email, password } = newUser;
    const isExistUser = await this.isEmailAlreadyUsed(email);

    if (isExistUser) {
      throw new NotFoundException("Sorry, this email is already in use");
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await AuthService.hashPassword(password);
    }

    await this.supabaseService.getSupabase().from("User").insert<createUserDto>({
      ...newUser,
      password: hashedPassword
    });

    const { data } = await this.supabaseService
      .getSupabase()
      .from("User")
      .select("id")
      .eq("email", email);

    console.log("********** User Registered Successfully ***********");
    return this.generateToken(data[0].id)
  }

  async login(userData: LoginUserDto): Promise<string> {
    console.log("********** Logging user ***********");
    const user = await this.authenticate(userData);
    console.log("********** User logged in Successfully ***********");
    return this.generateToken(user.id);
  }
  async authenticate(userData: LoginUserDto) {
    const { data } = await this.supabaseService.getSupabase()
      .from("User")
      .select()
      .eq("email", userData.email);

    if (data.length <= 0) {
      throw new NotFoundException("Unable too login. Please registered yourself");
    }

    const isMatch: boolean = await compare(userData.password, data[0].password);

    if (!isMatch) {
      throw new BadRequestException("Email or Password is incorrect");
    }
    return data[0];
  }
  private async isEmailAlreadyUsed(email: string): Promise<boolean | PostgrestError> {
    const { data, error } = await this.supabaseService
      .getSupabase()
      .from("User")
      .select("id")
      .eq("email", email)
      .limit(1);

    return data.length > 0 || error;
  }
  private static async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
  private async generateToken(id): Promise<string> {
    return sign({ id }, this.configService.get("JWT_SECRET"));
  }

}
