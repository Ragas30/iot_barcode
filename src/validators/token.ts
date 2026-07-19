import { z } from "zod";

export const createTokenSchema = z.object({
  name: z.string().optional().default("QR Token"),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;

export const verifyTokenSchema = z.object({
  token: z.string().min(1, "Token wajib diisi."),
});

export const setupPinSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4,8}$/, "PIN harus 4-8 digit angka."),
});

export const verifyPinSchema = z.object({
  pin: z
    .string()
    .regex(/^\d{4,8}$/, "PIN harus 4-8 digit angka."),
});
