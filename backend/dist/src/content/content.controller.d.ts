import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getCreatorContent(creatorId: string, req: any): Promise<{
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
    getPublicCreatorContent(creatorId: string): Promise<{
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
