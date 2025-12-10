// services/auth/AuthService.ts
import { User } from "@/types/auth";
import ApiClient from "../base/ApiClient";

// Interfaces para las requests
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: true;
    data: {
        user: User;
        token: string;
    };
}

export interface RegisterResponse {
    success: true;
    data: {
        user: User;
        token: string;
    };
}

// Servicios de autenticación
export const AuthService = {
    /**
     * Iniciar sesión
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        return await ApiClient.post<LoginResponse>('/auth/login', credentials);
    },

    /**
     * Registrar nuevo usuario
     */
    register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
        return await ApiClient.post<RegisterResponse>('/auth/register', credentials);
    },

};

export default AuthService;