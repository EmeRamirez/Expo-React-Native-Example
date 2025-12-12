// services/api/todos/todoService.ts
import ApiClient from '@/services/base/ApiClient';
import {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetTodoResponse,
  GetTodosResponse,
  UpdateTodoRequest,
  UpdateTodoResponse
} from '@/types/todos';

export const TodoService = {
  /**
   * Obtener todas las tareas del usuario
   */
  getAll: async (): Promise<GetTodosResponse> => {
    return await ApiClient.get<GetTodosResponse>('/todos');
  },

  /**
   * Obtener una tarea específica por ID
   */
  getById: async (id: string): Promise<GetTodoResponse> => {
    return await ApiClient.get<GetTodoResponse>(`/todos/${id}`);
  },

  /**
   * Crear una nueva tarea
   */
  create: async (data: CreateTodoRequest): Promise<CreateTodoResponse> => {
    return await ApiClient.post<CreateTodoResponse>('/todos', data);
  },

  /**
   * Actualizar completamente una tarea (PUT)
   */
  update: async (id: string, data: UpdateTodoRequest): Promise<UpdateTodoResponse> => {
    return await ApiClient.put<UpdateTodoResponse>(`/todos/${id}`, data);
  },

  /**
   * Actualizar parcialmente una tarea (PATCH)
   */
  patch: async (id: string, data: Partial<UpdateTodoRequest>): Promise<UpdateTodoResponse> => {
    return await ApiClient.patch<UpdateTodoResponse>(`/todos/${id}`, data);
  },

  /**
   * Eliminar una tarea
   */
  delete: async (id: string): Promise<DeleteTodoResponse> => {
    return await ApiClient.delete<DeleteTodoResponse>(`/todos/${id}`);
  },

  /**
   * Marcar tarea como completada
   */
  complete: async (id: string): Promise<UpdateTodoResponse> => {
    return await ApiClient.patch<UpdateTodoResponse>(`/todos/${id}`, {
      completed: true,
    });
  },

  /**
   * Marcar tarea como pendiente
   */
  uncomplete: async (id: string): Promise<UpdateTodoResponse> => {
    return await ApiClient.patch<UpdateTodoResponse>(`/todos/${id}`, {
      completed: false,
    });
  },
};

export default TodoService;