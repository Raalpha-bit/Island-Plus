import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CreatorsModule } from './creators/creators.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, CreatorsModule, ContentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
