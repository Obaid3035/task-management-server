import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { config } from "./config";
import { SupabaseService } from "./modules/supabase/supabase.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    })
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
  exports: [SupabaseService]
})
export class AppModule {}
