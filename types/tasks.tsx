interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number; // Precisión del GPS en metros
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  creationDate?: Date;
  imgUrl?: string;
  location?: Coordinates;
  completedAt?: Date | null; 
  priority?: 'low' | 'medium' | 'high';
}

