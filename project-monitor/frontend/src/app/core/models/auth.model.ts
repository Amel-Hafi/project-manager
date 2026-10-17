import { UserDTO } from './user.model';

export interface AuthResponse {
    token: string;
    user: UserDTO;
}

export interface LoginRequest {
    username: string;
    password: string;
}
