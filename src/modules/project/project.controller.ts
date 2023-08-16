import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateProjectDto } from "./dto/createProjectDto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDto } from "../auth/dto/user.dto";
import { ProjectService } from "./project.service";


@Controller('project')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {
  }

  @Post()
  async createProject(@CurrentUser() user: UserDto, @Body() body: CreateProjectDto) {
    return await this.projectService.createProject(user, body)
  }

  @Get()
  async findAllProjects() {
    return await this.projectService.findAllProjects();
  }

}
