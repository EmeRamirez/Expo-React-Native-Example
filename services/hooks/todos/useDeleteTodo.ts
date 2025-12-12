// services/hooks/todos/useDeleteTodo.ts
import { DeleteTodoResponse, GetTodosResponse } from '@/types/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeleteTodoResponse, ApiError, string>({
    mutationFn: (id) => TodoService.delete(id),
    onSuccess: (data, id) => {
      // Eliminar la tarea del caché de forma optimista
      queryClient.setQueryData<GetTodosResponse>(['todos'], (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.filter(todo => todo.id !== id),
          count: oldData.count - 1,
        };
      });
      
      // También eliminar la query individual
      queryClient.removeQueries({ queryKey: ['todos', id] });
    },
  });
};