import { Controller, Get, Param } from '@nestjs/common';
import { CreatorsService } from './creators.service';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Get()
  async getAll() {
    return this.creatorsService.getAllCreators();
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return this.creatorsService.findByUsername(username);
  }
}
