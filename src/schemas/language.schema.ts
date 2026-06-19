import { z } from "zod";

export const languageSchema = z.object({
    id: z.string(),
    name: z.string(),
    nativeName: z.string(),
    flagEmoji: z.string(),
    isSupported: z.boolean(),
});

export type Language = z.infer<typeof languageSchema>;

export const createLanguageSchema = z.object({
    id: z.string().min(1).max(10),
    name: z.string().min(1).max(255),
    nativeName: z.string().min(1).max(255),
    flagEmoji: z.string().optional(),
    isSupported: z.boolean().optional(),
});

export type CreateLanguageInput = z.infer<typeof createLanguageSchema>;

export const updateLanguageSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    nativeName: z.string().min(1).max(255).optional(),
    flagEmoji: z.string().optional(),
    isSupported: z.boolean().optional(),
});

export type UpdateLanguageInput = z.infer<typeof updateLanguageSchema>;
