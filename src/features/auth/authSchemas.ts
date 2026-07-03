import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const biometricsSchema = z.object({
  edad: z.number().min(10, 'Edad mínima 10').max(120, 'Edad máxima 120'),
  peso: z.number().min(20, 'Peso mínimo 20 kg').max(300, 'Peso máximo 300 kg'),
  altura: z.number().min(100, 'Altura mínima 100 cm').max(250, 'Altura máxima 250 cm'),
  genero: z.enum(['Masculino', 'Femenino']),
  nivelActividad: z.enum(['Sedentario', 'Ligero', 'Moderado', 'Activo', 'Muy activo']),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type BiometricsForm = z.infer<typeof biometricsSchema>;
