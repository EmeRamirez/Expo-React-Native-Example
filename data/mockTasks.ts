// mockTasks.ts
import { Task } from "@/types/tasks";

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Comprar víveres en el supermercado',
    description: 'Leche, huevos, pan, frutas y verduras frescas',
    completed: false,
    creationDate: new Date('2024-01-15T08:00:00'),
    priority: 'high',
    location: {
      latitude: -33.4489,
      longitude: -70.6693,
      accuracy: 15
    }
  },
  {
    id: '2',
    title: 'Reunión con el equipo de desarrollo',
    description: 'Revisar avances del proyecto y planificar sprint próximo',
    completed: true,
    creationDate: new Date('2024-01-10T10:30:00'),
    completedAt: new Date('2024-01-12T11:00:00'),
    priority: 'medium',
    location: {
      latitude: -33.4194,
      longitude: -70.6475,
      accuracy: 20
    }
  },
  {
    id: '3',
    title: 'Hacer ejercicio en el parque',
    description: '30 minutos de running y estiramientos',
    completed: false,
    creationDate: new Date('2024-01-14T07:00:00'),
    priority: 'medium',
    imgUrl: 'https://example.com/images/exercise.jpg'
  },
  {
    id: '4',
    title: 'Leer libro de React Native',
    description: 'Avanzar hasta el capítulo 8 sobre navegación',
    completed: false,
    creationDate: new Date('2024-01-13T20:00:00'),
    priority: 'low',
    location: {
      latitude: -33.4567,
      longitude: -70.6567,
      accuracy: 10
    }
  },
  {
    id: '5',
    title: 'Llamar al médico para cita',
    description: 'Solicitar cita para chequeo anual',
    completed: true,
    creationDate: new Date('2024-01-08T09:15:00'),
    completedAt: new Date('2024-01-08T10:00:00'),
    priority: 'high'
  },
  {
    id: '6',
    title: 'Preparar presentación para cliente',
    description: 'Crear slides y practicar el pitch',
    completed: false,
    creationDate: new Date('2024-01-14T14:00:00'),
    priority: 'high',
    imgUrl: 'https://example.com/images/presentation.jpg',
    location: {
      latitude: -33.4372,
      longitude: -70.6506,
      accuracy: 25
    }
  },
  {
    id: '7',
    title: 'Limpiar y organizar el escritorio',
    description: 'Ordenar documentos y limpiar el área de trabajo',
    completed: true,
    creationDate: new Date('2024-01-11T16:30:00'),
    completedAt: new Date('2024-01-11T17:45:00'),
    priority: 'low'
  },
  {
    id: '8',
    title: 'Investigar nuevas librerías de React Native',
    description: 'Revisar Expo SDK 49 y nuevas funcionalidades',
    completed: false,
    creationDate: new Date('2024-01-12T11:00:00'),
    priority: 'medium',
    location: {
      latitude: -33.4417,
      longitude: -70.6389,
      accuracy: 12
    }
  },
  {
    id: '9',
    title: 'Reservar restaurante para cena',
    description: 'Mesa para 4 personas el viernes a las 20:00',
    completed: true,
    creationDate: new Date('2024-01-09T12:00:00'),
    completedAt: new Date('2024-01-09T12:30:00'),
    priority: 'medium',
    location: {
      latitude: -33.4289,
      longitude: -70.6203,
      accuracy: 18
    }
  },
  {
    id: '10',
    title: 'Backup de archivos importantes',
    description: 'Hacer copia de seguridad en disco externo',
    completed: false,
    creationDate: new Date('2024-01-14T18:00:00'),
    priority: 'high',
    imgUrl: 'https://example.com/images/backup.jpg'
  }
];