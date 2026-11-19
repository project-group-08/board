import { z } from "zod";

export const RequestEmailLinkSchema = z.object({
  email: z.email().max(320),
});

export type RequestEmailLink = z.infer<typeof RequestEmailLinkSchema>;