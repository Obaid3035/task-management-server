import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { config } from "./config";
import { SupabaseService } from "./modules/supabase/supabase.service";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_PIPE } from "@nestjs/core";
import { ProjectModule } from "./modules/project/project.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    AuthModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
    }),
  }],
  exports: [SupabaseService]
})
export class AppModule {}
