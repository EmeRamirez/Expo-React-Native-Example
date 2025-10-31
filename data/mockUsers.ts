import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emerson Ramirez',
    email: 'emerson@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Amanecer Cabrera',
    email: 'amanecer@example.com',
    role: 'user',
  },
  {
    id: '3',
    name: 'Carlos Gonzalez',
    email: 'carlos@example.com',
    role: 'user',
  },
  {
    id: '4',
    name: 'Camila Astorga',
    email: 'camila@example.com',
    role: 'user',
  }
];

export const userPasswords: Record<string, string> = {
  'emerson@example.com': 'emerson123',
  'amanecer@example.com': 'amanecer123',
  'carlos@example.com': 'carlos123',
  'camila@example.com': 'camila123',
};