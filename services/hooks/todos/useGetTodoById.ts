// services/hooks/todos/useGetTodoById.ts
import { GetTodoResponse } from '@/types/todos';
import { useQuery } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useGetTodoById = (id: string | undefined) => {
  return useQuery<GetTodoResponse, ApiError>({
    queryKey: ['todos', id],
    queryFn: () => {
      if (!id) throw new Error('ID de tarea no proporcionado');
      return TodoService.getById(id);
    },
    enabled: !!id, // Solo ejecuta si hay ID
    staleTime: 5 * 60 * 1000,
  });
};