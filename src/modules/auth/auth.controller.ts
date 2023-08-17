import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
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
  async register(@Res() res, @Body() body: createUserDto) {
    const token = await this.authService.register(body)
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    res.status(200).json({
      message: 'Registration Successful'
    })
  }

  @Post("login")
  async login(@Res() res, @Body() body: LoginUserDto) {
    const token = await this.authService.login(body);
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    res.status(200).json({
      message: 'Login Successful'
    })
  }

  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    res.json({ message: 'Logged out' });
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
