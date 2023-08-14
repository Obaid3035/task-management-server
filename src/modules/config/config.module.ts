import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';


@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['../../config/dev.env']
    })
  ]
})

export class ConfigModule {};
