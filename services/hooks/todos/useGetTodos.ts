// services/hooks/todos/useGetTodos.ts
import { TodoService } from '@/services/api/todos/todoService';
import { GetTodosResponse } from '@/types/todos';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../base/ApiClient';

export const useGetTodos = () => {
  return useQuery<GetTodosResponse, ApiError>({
    queryKey: ['todos'],
    queryFn: TodoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};