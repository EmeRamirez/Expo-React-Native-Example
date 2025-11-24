import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Emerson Ramirez',
    email: 'eme@email.com',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Amanecer Cabrera',
    email: 'ami@email.com',
    role: 'user',
  },
  {
    id: 3,
    name: 'Carlos Gonzalez',
    email: 'carlos@email.com',
    role: 'user',
  },
  {
    id: 4,
    name: 'Camila Astorga',
    email: 'cami@email.com',
    role: 'user',
  }
];

export const userPasswords: Record<string, string> = {
  'eme@email.com': 'eme123',
  'ami@email.com': 'ami123',
  'carlos@email.com': 'carlos123',
  'cami@email.com': 'cami123',
};