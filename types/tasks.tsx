export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // Precisión del GPS en metros
}

export interface Task {
  id: string;
  userId: number;
  title: string;
  description?: string;
  completed: boolean;
  imgUri?: string;
  location?: Coordinates;
  priority?: 'low' | 'medium' | 'high';
}

