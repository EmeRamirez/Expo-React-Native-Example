// services/hooks/todos/usePatchTodo.ts
import { UpdateTodoRequest, UpdateTodoResponse } from '@/types/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const usePatchTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateTodoResponse, ApiError, { id: string; data: Partial<UpdateTodoRequest> }>({
    mutationFn: ({ id, data }) => TodoService.patch(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', variables.id] });
      
      // Actualizar el caché de forma optimista
      queryClient.setQueryData(['todos', variables.id], data);
    },
  });
};