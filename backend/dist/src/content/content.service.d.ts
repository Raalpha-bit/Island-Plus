import { PrismaService } from '../prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getCreatorContent(creatorId: string, userReq: any): Promise<{
        isLocked: boolean;
        url: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        creatorId: string;
        title: string;
        type: string;
        visibility: string;
        minimumTier: string | null;
        likesCount: number;
    }[]>;
}
