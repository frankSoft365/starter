import { z } from "zod";

export const SearchParamSchema = z.object({
  q: z.string().default(""),
});
