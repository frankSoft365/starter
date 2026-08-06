import * as z from "zod";
import { PasswordSchema } from "./auth";

const USERNAME_REGEX = /^[a-zA-Z0-9_\-]+$/;

const UsernameSchema = z.string()
    .trim()
    .min(1, "account.validate.usernameRequired")
    .min(6, "account.validate.usernameLength")
    .max(20, "account.validate.usernameLength")
    .regex(USERNAME_REGEX, "account.validate.usernameRegex");

export const AccountUpdateSchema = z.object({
    username: UsernameSchema
});

export const ChangePasswordSchema = z.object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema
});

export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export type AccountUpdateForm = z.infer<typeof AccountUpdateSchema>;