import { z } from "zod";

export const RequestEmailLinkSchema = z.object({
  email: z.email().max(320),
});

export type RequestEmailLink = z.infer<typeof RequestEmailLinkSchema>;

export const VerifyEmailLinkSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
});

export type VerifyEmailLink = z.infer<typeof VerifyEmailLinkSchema>;
export const AuthSessionSchema = z.object({
  username: z.string().nullable(),
  needsProfile: z.boolean(),
});

export type AuthSession = z.infer<typeof AuthSessionSchema>;

export const UpdateAuthProfileSchema = z.object({
  username: z.string().trim().min(1).max(100),
});

export type UpdateAuthProfile = z.infer<typeof UpdateAuthProfileSchema>;
