import { z } from "zod";

export const openSafeSchema = z.object({
  token: z.string().min(1, "Token wajib diisi."),
});

export type OpenSafeInput = z.infer<typeof openSafeSchema>;
