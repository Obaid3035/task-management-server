import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { SupabaseService } from "../supabase/supabase.service";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, SupabaseService]
})
export class ProjectModule {}
