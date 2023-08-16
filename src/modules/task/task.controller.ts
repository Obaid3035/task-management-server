import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateTaskDto } from "./dto/CreateTaskDto";
import { TaskService } from "./task.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserDto } from "../auth/dto/user.dto";


@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {
  }
  @Post('/:id')
  async createTask(@Body() task: CreateTaskDto, @Param('id') project_id: number){
    return await this.tasksService.createTask(task, project_id);
  }
  @Get('/:id')
  async findAllTasks(@Param('id') project_id: number) {
    return await this.tasksService.findAllTasks(project_id);
  }
}
