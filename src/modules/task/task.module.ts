import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { SupabaseService } from "../supabase/supabase.service";

@Module({
  controllers: [TaskController],
  providers: [TaskService, SupabaseService],
})
export class TaskModule {}
