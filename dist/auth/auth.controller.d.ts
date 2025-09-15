import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        expires_in: string;
    }>;
}
