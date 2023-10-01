import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string(),
  username: z.string().optional(),
  firstName: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
