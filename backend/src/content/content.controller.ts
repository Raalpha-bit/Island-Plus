import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('creator/:id')
  async getCreatorContent(@Param('id') creatorId: string, @Request() req: any) {
    return this.contentService.getCreatorContent(creatorId, req.user);
  }

  // Public endpoint for non-logged in users viewing a profile
  @Get('public/creator/:id')
  async getPublicCreatorContent(@Param('id') creatorId: string) {
    return this.contentService.getCreatorContent(creatorId, null);
  }
}
