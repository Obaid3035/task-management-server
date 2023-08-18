import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dto/createProjectDto";
import { SupabaseService } from "../supabase/supabase.service";
import { UserDto } from "../auth/dto/user.dto";
import { ProjectDto } from "./dto/ProjectDto";
import { TASK_Status } from "../../enum";


@Injectable()
export class ProjectService {

  constructor(private readonly supabaseService: SupabaseService) {
  }

  async findAllProjects() {
    const { data: projects } = await this.supabaseService
      .getSupabase()
      .from("Project")
      .select(
        `id,
        title,
        created_at,
        deadline, 
        UserProject(id, User(id, name))`);
    return await Promise.all(
      projects.map(async (project) => {
        const { data: tasks, error } = await this.supabaseService
          .getSupabase()
          .from("Task")
          .select("status")
          .eq("project_id", project.id);
        if (error) {
          throw new BadRequestException("Something went wrong!");
        }

        const total_task = tasks.length;
        const completed_task = tasks.filter((task) => task.status === TASK_Status.COMPLETED).length;
        return {
          ...project,
          users: project.UserProject.map((el: any) => ({
            id: el.User.id,
            name: el.User.name
          })),
          total_task,
          completed_task
        };
      })
    );
  }

  async createProject(currentUser: UserDto, newProject: CreateProjectDto) {
    const { data, error } = await this.supabaseService
      .getSupabase()
      .from("Project")
      .insert<ProjectDto>({
        title: newProject.title,
        deadline: newProject.deadline,
        user_id: currentUser.id
      })
      .select("id");

    if (error) {
      throw new BadRequestException("Invalid Data");
    }

    const userProjectData = newProject.users.map((id) => ({
      user_id: id,
      project_id: data[0].id
    }));

    await this.supabaseService
      .getSupabase()
      .from("UserProject")
      .insert(userProjectData);

    return {
      saved: true
    };
  }
}
