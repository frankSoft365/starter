import * as z from "zod";

const USERNAME_REGEX = /^[a-zA-Z0-9_\-]+$/;

const UsernameSchema = z.string()
    .trim()
    .min(1, "Username is required")
    .min(6, "Username must be between 6 and 20 characters.")
    .max(20, "Username must be between 6 and 20 characters.")
    .regex(USERNAME_REGEX, "Username does not match required format");

export const AccountUpdateSchema = z.object({
    username: UsernameSchema
});

export type AccountUpdateForm = z.infer<typeof AccountUpdateSchema>;