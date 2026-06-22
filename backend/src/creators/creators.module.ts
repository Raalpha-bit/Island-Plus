import { Module } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CreatorsController],
  providers: [CreatorsService],
  exports: [CreatorsService],
})
export class CreatorsModule {}
