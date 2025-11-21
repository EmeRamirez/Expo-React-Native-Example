import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Emerson Ramirez',
    email: 'eme',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Amanecer Cabrera',
    email: 'amanecer',
    role: 'user',
  },
  {
    id: 3,
    name: 'Carlos Gonzalez',
    email: 'carlos',
    role: 'user',
  },
  {
    id: 4,
    name: 'Camila Astorga',
    email: 'camila',
    role: 'user',
  }
];

export const userPasswords: Record<string, string> = {
  'eme': 'eme123',
  'amanecer': 'amanecer123',
  'carlos': 'carlos123',
  'camila': 'camila123',
};