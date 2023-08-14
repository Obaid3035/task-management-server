import { Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { createUserDto } from "./dto/createUserDto";
import { hash } from 'bcrypt';
import { sign } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { PostgrestError } from "@supabase/supabase-js";

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async register(newUser: createUserDto): Promise<string> {
    console.log("********** Registering user ***********");
    const { email, password } = newUser;
    const isExistUser = await this.isEmailAlreadyUsed(email);

    if (isExistUser) {
      throw new NotFoundException("Sorry, this email is already in use");
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword =  await hash(password, 10)
    }

    await this.supabaseService.getSupabase().from("User").insert<createUserDto>({
      ...newUser,
      password: hashedPassword,
    });

    const { data } = await this.supabaseService
      .getSupabase()
      .from("User")
      .select("id")
      .eq("email", email);

    console.log("********** User Registered Successfully ***********");
    return sign({ id: data[0].id }, this.configService.get("JWT_SECRET"));
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

}
