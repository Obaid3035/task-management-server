import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { UserDto } from "../auth/dto/user.dto";
import { CreateTaskDto } from "./dto/CreateTaskDto";
import { Status } from "../../enum";


@Injectable()
export class TaskService {
  constructor(private readonly supabaseService: SupabaseService) {
  }

  async createTask(newTask: CreateTaskDto, projectId: number) {
    const { data, error } = await this.supabaseService.getSupabase()
      .from("Task")
      .insert({
        title: newTask.title,
        description: newTask.description,
        status: Status.IN_PROGRESS,
        priority: newTask.priority,
        deadline: newTask.deadline,
        project_id: projectId
      })
      .select();

    if (error) {
      throw new BadRequestException("Invalid Data");
    }

    const userTaskData = newTask.users.map((id) => ({
      user_id: id,
      task_id: data[0].id
    }));

    await this.supabaseService
      .getSupabase()
      .from("UserTask")
      .insert(userTaskData);

    return {
      saved: true
    };
  }

  async findAllTasks(projectId: number){
    const { data } = await this.supabaseService
      .getSupabase()
      .from('Task')
      .select(
        `id,
        title,
        description,
        status,
        priority,
        created_at,
        deadline, 
        UserTask(id, User(id, name))`)
      .eq('project_id', projectId)
    return data
  }
}
