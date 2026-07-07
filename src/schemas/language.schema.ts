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
    id: z.string().min(1, "Mã ngôn ngữ không được để trống").max(10, "Mã ngôn ngữ tối đa 10 ký tự"),
    name: z.string().min(1, "Tên ngôn ngữ không được để trống").max(255, "Tên ngôn ngữ tối đa 255 ký tự"),
    nativeName: z.string().min(1, "Tên bản ngữ không được để trống").max(255, "Tên bản ngữ tối đa 255 ký tự"),
    flagEmoji: z.string().optional(),
    isSupported: z.boolean().optional(),
});

export type CreateLanguageInput = z.infer<typeof createLanguageSchema>;

export const updateLanguageSchema = z.object({
    name: z.string().min(1, "Tên ngôn ngữ không được để trống").max(255, "Tên ngôn ngữ tối đa 255 ký tự").optional(),
    nativeName: z.string().min(1, "Tên bản ngữ không được để trống").max(255, "Tên bản ngữ tối đa 255 ký tự").optional(),
    flagEmoji: z.string().optional(),
    isSupported: z.boolean().optional(),
});

export type UpdateLanguageInput = z.infer<typeof updateLanguageSchema>;

export interface LanguageQuery {
    search?: string;
    isSupported?: boolean;
}
