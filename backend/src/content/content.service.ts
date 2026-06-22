import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getCreatorContent(creatorId: string, userReq: any) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new Error('Creator not found');
    }

    const allContent = await this.prisma.content.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
    });

    if (!userReq) {
      // Unauthenticated: return only public content
      return allContent.map(c => ({
        ...c,
        isLocked: c.visibility !== 'PUBLIC',
        url: c.visibility === 'PUBLIC' ? c.url : null,
      }));
    }

    // If it's the creator themselves
    if (creator.userId === userReq.sub) {
      return allContent.map(c => ({ ...c, isLocked: false }));
    }

    // Check if the user is subscribed
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userReq.sub,
          creatorId: creator.id,
        },
      },
    });

    const isSubscribed = subscription && subscription.status === 'ACTIVE';

    return allContent.map(c => {
      let isLocked = true;
      if (c.visibility === 'PUBLIC') isLocked = false;
      if (c.visibility === 'SUBSCRIBERS_ONLY' && isSubscribed) isLocked = false;
      // TIER_SPECIFIC logic can be added here comparing c.minimumTier to subscription.tier

      return {
        ...c,
        isLocked,
        url: isLocked ? null : c.url, // Mask URL if locked
      };
    });
  }
}
