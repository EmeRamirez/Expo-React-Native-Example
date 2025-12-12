// services/hooks/todos/useCreateTodo.ts
import { CreateTodoRequest, CreateTodoResponse } from '@/types/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateTodoResponse, ApiError, CreateTodoRequest>({
    mutationFn: TodoService.create,
    onSuccess: () => {
      // Invalidar la caché de todas las tareas
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};