import { z } from "zod";

export const createTokenSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;
