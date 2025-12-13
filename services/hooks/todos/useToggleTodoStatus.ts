import { GetTodosResponse, UpdateTodoResponse } from '@/types/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoService } from '../../api/todos/todoService';
import { ApiError } from '../../base/ApiClient';

export const useToggleTodoStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateTodoResponse, ApiError, { id: string; completed: boolean }, { previousTodo: any; previousTodos: GetTodosResponse | undefined }>({
    mutationFn: ({ id, completed }) => 
      completed ? TodoService.complete(id) : TodoService.uncomplete(id),
    onMutate: async ({ id, completed }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['todos', id] });
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      
      // Snapshot del estado anterior
      const previousTodo = queryClient.getQueryData(['todos', id]);
      const previousTodos = queryClient.getQueryData<GetTodosResponse>(['todos']);
      
      // Actualización optimista
      if (previousTodo) {
        queryClient.setQueryData(['todos', id], {
          ...previousTodo,
          data: { ...(previousTodo as any).data, completed },
        });
      }
      
      if (previousTodos) {
        queryClient.setQueryData(['todos'], {
          ...previousTodos,
          data: previousTodos.data.map(todo =>
            todo.id === id ? { ...todo, completed } : todo
          ),
        });
      }
      
      return { previousTodo, previousTodos };
    },
    onError: (err, variables, context) => {
      // Revertir en caso de error
      if (context?.previousTodo) {
        queryClient.setQueryData(['todos', variables.id], context.previousTodo);
      }
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch después de la mutación
      queryClient.invalidateQueries({ queryKey: ['todos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};