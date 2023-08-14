import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUserDto } from "./dto/createUserDto";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
  async register(@Body() body: createUserDto) {
    return {
      token: await this.authService.register(body),
    }
  }
}
