import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  username: z.string().optional(),
  firstName: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
