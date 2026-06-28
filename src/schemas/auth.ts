import * as z from "zod";

const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%*+=_\-]+$/;

const PasswordSchema = z.string()
    .trim()
    .min(1, "Password is required")
    .min(6, "Password must be between 6 and 20 characters.")
    .max(20, "Password must be between 6 and 20 characters.")
    .regex(PASSWORD_REGEX, "Password does not match required format");

export const ChangePasswordSchema = z.object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema
});

export const LoginSchema = z.object({
    email: z.email(),
    password: PasswordSchema
})

export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export type LoginForm = z.infer<typeof LoginSchema>;