import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z.email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export const updateAdminSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(100, "Nama maksimal 100 karakter.")
      .optional(),
    email: z.email("Email tidak valid.").optional(),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter.")
      .optional(),
    resetPin: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Tidak ada data yang diubah.",
  });

export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
