export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // Precisión del GPS en metros
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  photoUri?: string;
  location?: Coordinates;
  createdAt: string;
  updatedAt: string;
}

