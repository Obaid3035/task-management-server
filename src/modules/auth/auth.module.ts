import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SupabaseService } from "../supabase/supabase.service";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";

@Module({
  providers: [AuthService, SupabaseService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {

    consumer.apply(CurrentUserMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
