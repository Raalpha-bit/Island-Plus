import { PrismaService } from '../prisma/prisma.service';
export declare class CreatorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUsername(username: string): Promise<{
        creatorProfile: ({
            content: {
                url: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                creatorId: string;
                title: string;
                type: string;
                visibility: string;
                minimumTier: string | null;
                likesCount: number;
            }[];
            _count: {
                subscribers: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            displayName: string;
            bio: string | null;
            avatar: string | null;
            coverImage: string | null;
            isLive: boolean;
            subscriptionPrice: number;
        }) | null;
        id: string;
        email: string;
        username: string;
        role: string;
        dob: Date;
        walletBalance: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllCreators(): Promise<({
        user: {
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        displayName: string;
        bio: string | null;
        avatar: string | null;
        coverImage: string | null;
        isLive: boolean;
        subscriptionPrice: number;
    })[]>;
}
