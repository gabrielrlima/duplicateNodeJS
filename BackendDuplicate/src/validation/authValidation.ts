import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres!' })
    .trim(),
  lastName: z.string()
    .min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres!' })
    .trim(),
  email: z.string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço válido!' })
    .toLowerCase(),
  password: z.string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres!' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial!'
    }),
  passwordConfirmation: z.string()
    .min(1, { message: 'Confirmação de senha é obrigatória!' }),
  phone: z.string().optional(),
  businessId: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem!",
  path: ["passwordConfirmation"],
});

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço válido!' })
    .toLowerCase(),
  password: z.string()
    .min(1, { message: 'Senha é obrigatória!' })
});

export const checkEmailSchema = z.object({
  email: z.string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço válido!' })
    .toLowerCase()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckEmailInput = z.infer<typeof checkEmailSchema>;