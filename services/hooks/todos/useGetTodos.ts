// services/hooks/todos/useGetTodos.ts 
import { useAuth } from '@/context/AuthContext';
import { GetTodosResponse } from '@/types/todos';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useGetTodos = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery<GetTodosResponse, ApiError>({
    queryKey: ['todos'],
    queryFn: TodoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    enabled: isAuthenticated, // Clave: solo ejecutar si autenticado
    retry: false, // Desactivar reintentos para mejor control
  });

  // Efecto para cancelar la query cuando se desautentica
  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.cancelQueries({ queryKey: ['todos'] });
    }
  }, [isAuthenticated, queryClient]);

  return query;
};