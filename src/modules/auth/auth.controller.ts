import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUserDto } from "./dto/createUserDto";
import { LoginUserDto } from "./dto/loginUserDto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { UserDto } from "./dto/user.dto";


@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("register")
  async register(@Body() body: createUserDto) {
    return {
      token: await this.authService.register(body)
    };
  }

  @Post("login")
  async login(@Body() body: LoginUserDto) {
    return {
      token: await this.authService.login(body)
    };
  }

  @Get("/user-project")
  async getAllUserForProjectSelect(@CurrentUser() currentUser: UserDto) {
    return await this.authService.getAllUserForProjectSelect(currentUser.id);
  }

  @Get("/user-task/:id")
  async getAllUserForTaskSelect(@Param("id") projectId: number) {
    return await this.authService.getAllUserForTaskSelect(projectId);
  }

}
