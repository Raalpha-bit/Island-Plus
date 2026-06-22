import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
            dob: Date;
            walletBalance: number;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    getProfile(req: any): any;
}
