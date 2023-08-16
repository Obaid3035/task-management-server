import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateTaskDto } from "./dto/CreateTaskDto";
import { TaskService } from "./task.service";


@Controller("task")
export class TaskController {
  constructor(private readonly tasksService: TaskService) {
  }

  @Post("/:id")
  async createTask(@Body() task: CreateTaskDto, @Param("id") project_id: number) {
    return await this.tasksService.createTask(task, project_id);
  }

  @Get("/:id")
  async findAllTasks(@Param("id") project_id: number) {
    return await this.tasksService.findAllTasks(project_id);
  }

  @Put("/to-completed/:id")
  async statusToCompleted(@Param("id") task_id: number) {
    return await this.tasksService.statusToCompleted(task_id);
  }

  @Put("/to-cancelled/:id")
  async statusToCancelled(@Param("id") task_id: number) {
    return await this.tasksService.statusToCancelled(task_id);
  }
}
