import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        username: string;
        role: string;
        dob: Date;
        walletBalance: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getWalletBalance(req: any): Promise<{
        balance: number;
    }>;
}
