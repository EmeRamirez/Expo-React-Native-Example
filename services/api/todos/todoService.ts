// services/api/todos/todoService.ts
import {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetTodoResponse,
  GetTodosResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@/types/todos';
import { getTokenFromStorage } from '@/utils/storage';
import ApiClient from '../../base/ApiClient';

// Función helper para obtener headers con token
const getAuthHeaders = async () => {
  const token = await getTokenFromStorage();
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const TodoService = {
  /**
   * Obtener todas las tareas del usuario
   */
  getAll: async (): Promise<GetTodosResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.get<GetTodosResponse>('/todos', { headers });
  },

  /**
   * Obtener una tarea específica por ID
   */
  getById: async (id: string): Promise<GetTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.get<GetTodoResponse>(`/todos/${id}`, { headers });
  },

  /**
   * Crear una nueva tarea
   */
  create: async (data: CreateTodoRequest): Promise<CreateTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.post<CreateTodoResponse>('/todos', data, { headers });
  },

  /**
   * Actualizar completamente una tarea (PUT)
   */
  update: async (id: string, data: UpdateTodoRequest): Promise<UpdateTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.put<UpdateTodoResponse>(`/todos/${id}`, data, { headers });
  },

  /**
   * Actualizar parcialmente una tarea (PATCH)
   */
  patch: async (id: string, data: Partial<UpdateTodoRequest>): Promise<UpdateTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.patch<UpdateTodoResponse>(`/todos/${id}`, data, { headers });
  },

  /**
   * Eliminar una tarea
   */
  delete: async (id: string): Promise<DeleteTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.delete<DeleteTodoResponse>(`/todos/${id}`, { headers });
  },

  /**
   * Marcar tarea como completada
   */
  complete: async (id: string): Promise<UpdateTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.patch<UpdateTodoResponse>(
      `/todos/${id}`, 
      { completed: true }, 
      { headers }
    );
  },

  /**
   * Marcar tarea como pendiente
   */
  uncomplete: async (id: string): Promise<UpdateTodoResponse> => {
    const headers = await getAuthHeaders();
    return await ApiClient.patch<UpdateTodoResponse>(
      `/todos/${id}`, 
      { completed: false }, 
      { headers }
    );
  },
};

export default TodoService;