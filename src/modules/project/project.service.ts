import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dto/createProjectDto";
import { SupabaseService } from "../supabase/supabase.service";
import { UserDto } from "../auth/dto/user.dto";
import { ProjectDto } from "./dto/ProjectDto";


@Injectable()
export class ProjectService {

  constructor(private readonly supabaseService: SupabaseService) {
  }

  async findAllProjects(){
    const { data } = await this.supabaseService
      .getSupabase()
      .from('Project')
      .select(
        `id,
        title,
        created_at,
        deadline, 
        User(id, name),
        UserProject(id, User(id, name))`,)
    return data
  }

  async createProject(currentUser: UserDto, newProject: CreateProjectDto) {
    const { data, error } = await this.supabaseService
      .getSupabase()
      .from('Project')
      .insert<ProjectDto>({
        title: newProject.title,
        deadline: newProject.deadline,
        user_id: currentUser.id
      })
      .select('id');

    if (error) {
      throw new BadRequestException('Invalid Data')
    }

    const userProjectData = newProject.users.map((id) => ({
      user_id: id,
      project_id: data[0].id
    }));

    await this.supabaseService
      .getSupabase()
      .from('UserProject')
      .insert(userProjectData)

    return {
      saved: true
    }
  }

}
