import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProjectDto } from "./dto/createProjectDto";
import { SupabaseService } from "../supabase/supabase.service";
import { UserDto } from "../auth/dto/user.dto";
import { ProjectDto } from "./dto/ProjectDto";


@Injectable()
export class ProjectService {

  constructor(private readonly supabaseService: SupabaseService) {
  }

  async createProject(currentUser: UserDto, newProject: CreateProjectDto) {
    const { data, error} = await this.supabaseService
      .getSupabase()
      .from('Project')
      .insert<ProjectDto>({
        ...newProject,
        user_id: currentUser.id
      });

    if (error) {
      throw new BadRequestException('Invalid Data')
    }

    return {
      saved: true
    }
  }

}
