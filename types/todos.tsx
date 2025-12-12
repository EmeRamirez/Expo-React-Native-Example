// types/todos.tsx
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  location?: Location;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateTodoRequest {
  title: string;
  completed?: boolean;
  location?: Location;
  photoUri?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  location?: Location;
  photoUri?: string;
}

// Response types
export interface GetTodosResponse {
  success: true;
  data: Todo[];
  count: number;
}

export interface GetTodoResponse {
  success: true;
  data: Todo;
}

export interface CreateTodoResponse {
  success: true;
  data: Todo;
}

export interface UpdateTodoResponse {
  success: true;
  data: Todo;
}

export interface DeleteTodoResponse {
  success: true;
  data: Todo;
  message: string;
}