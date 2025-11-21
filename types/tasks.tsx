interface Coordinates {
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
  creationDate?: Date;
  imgUri?: string;
  location?: Coordinates;
  completedAt?: Date | null; 
  priority?: 'low' | 'medium' | 'high';
}

