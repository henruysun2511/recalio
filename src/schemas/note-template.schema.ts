import { NoteTemplateType } from "@/constants/type";
import { z } from "zod";

export const cardTemplateSchema = z.object({
    id: z.string().uuid(),
    noteTemplateId: z.string().uuid(),
    name: z.string(),
    frontHtml: z.string(),
    backHtml: z.string(),
    css: z.string().optional(),
});

export type CardTemplate = z.infer<typeof cardTemplateSchema>;

export const noteTemplateSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.nativeEnum(NoteTemplateType),
    fieldNames: z.array(z.string()),
    cardTemplates: z.array(cardTemplateSchema).optional(),
});

export type NoteTemplate = z.infer<typeof noteTemplateSchema>;

export const createNoteTemplateSchema = z.object({
    name: z.string().min(1, "Tên mẫu không được để trống").max(255, "Tên mẫu tối đa 255 ký tự"),
    type: z.nativeEnum(NoteTemplateType, { message: "Loại mẫu không hợp lệ" }),
    fieldNames: z.array(z.string()).min(1, "Phải có ít nhất một trường"),
    cardTemplates: z.array(z.object({
        name: z.string().min(1, "Tên mẫu thẻ không được để trống"),
        frontHtml: z.string().min(1, "Nội dung mặt trước không được để trống"),
        backHtml: z.string().min(1, "Nội dung mặt sau không được để trống"),
        css: z.string().optional(),
    })).optional(),
});

export type CreateNoteTemplateInput = z.infer<typeof createNoteTemplateSchema>;

export const updateNoteTemplateSchema = z.object({
    name: z.string().min(1, "Tên mẫu không được để trống").max(255, "Tên mẫu tối đa 255 ký tự").optional(),
    type: z.nativeEnum(NoteTemplateType, { message: "Loại mẫu không hợp lệ" }).optional(),
    fieldNames: z.array(z.string()).min(1, "Phải có ít nhất một trường").optional(),
});

export type UpdateNoteTemplateInput = z.infer<typeof updateNoteTemplateSchema>;

export const createCardTemplateSchema = z.object({
    name: z.string().min(1, "Tên mẫu thẻ không được để trống"),
    frontHtml: z.string().min(1, "Nội dung mặt trước không được để trống"),
    backHtml: z.string().min(1, "Nội dung mặt sau không được để trống"),
    css: z.string().optional(),
});

export type CreateCardTemplateInput = z.infer<typeof createCardTemplateSchema>;

export const updateCardTemplateSchema = z.object({
    name: z.string().min(1, "Tên mẫu thẻ không được để trống").optional(),
    frontHtml: z.string().optional(),
    backHtml: z.string().optional(),
    css: z.string().optional(),
});

export type UpdateCardTemplateInput = z.infer<typeof updateCardTemplateSchema>;
