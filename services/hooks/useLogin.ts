// services/hooks/useLogin.ts
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { AuthService, LoginCredentials, LoginResponse } from '../auth/AuthService';
import { ApiError } from '../base/ApiClient';

export const useLogin = () => {
    const { updateAuthState } = useAuth();
    
    return useMutation<LoginResponse, ApiError, LoginCredentials>({
        mutationFn: AuthService.login,
        onSuccess: async (data) => {
            console.log('Login exitoso. Usuario:', data.data.user.email);
            
            try {
                // Actualizar el AuthContext con los nuevos datos
                const success = await updateAuthState(data.data.user, data.data.token);
                
                if (success) {
                    console.log('Estado de autenticación actualizado correctamente');
                } else {
                    console.error('Error al actualizar el estado de autenticación');
                    // Podrías lanzar un error aquí si es crítico
                }
            } catch (error) {
                console.error('Error en onSuccess:', error);
            }
        },
        onError: (error: ApiError) => {
            console.error('Error en login:', error.message);
            // El error ya viene formateado desde ApiClient
        }
    });
};