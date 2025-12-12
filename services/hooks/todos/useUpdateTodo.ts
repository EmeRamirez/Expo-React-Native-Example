// services/hooks/todos/useUpdateTodo.ts
import { UpdateTodoRequest, UpdateTodoResponse } from '@/types/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateTodoResponse, ApiError, { id: string; data: UpdateTodoRequest }>({
    mutationFn: ({ id, data }) => TodoService.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidar tanto la lista como la tarea específica
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', variables.id] });
    },
  });
};