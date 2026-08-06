import * as z from "zod";

const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%*+=_\-]+$/;

export const PasswordSchema = z.string()
    .trim()
    .min(1, "auth.validate.passwordRequired")
    .min(6, "auth.validate.passwordLength")
    .max(20, "auth.validate.passwordLength")
    .regex(PASSWORD_REGEX, "auth.validate.passwordRegex");

export const LoginSchema = z.object({
    email: z.email(),
    password: PasswordSchema
})

export type LoginForm = z.infer<typeof LoginSchema>;