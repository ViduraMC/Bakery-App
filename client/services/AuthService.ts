import apiClient from './apiClient';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    username?: string;
    role?: string;
    error?: string;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/register', credentials);
        return response.data;
    }
}

export default new AuthService();
