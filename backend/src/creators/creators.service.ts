import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        creatorProfile: {
          include: {
            content: true,
            _count: {
              select: { subscribers: true },
            },
          },
        },
      },
    });

    if (!user || !user.creatorProfile) {
      throw new NotFoundException('Creator not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async getAllCreators() {
    return this.prisma.creatorProfile.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
}
