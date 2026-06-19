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
    name: z.string().min(1).max(255),
    type: z.nativeEnum(NoteTemplateType),
    fieldNames: z.array(z.string()).min(1),
    cardTemplates: z.array(z.object({
        name: z.string().min(1),
        frontHtml: z.string().min(1),
        backHtml: z.string().min(1),
        css: z.string().optional(),
    })).optional(),
});

export type CreateNoteTemplateInput = z.infer<typeof createNoteTemplateSchema>;

export const updateNoteTemplateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    type: z.nativeEnum(NoteTemplateType).optional(),
    fieldNames: z.array(z.string()).min(1).optional(),
});

export type UpdateNoteTemplateInput = z.infer<typeof updateNoteTemplateSchema>;

export const createCardTemplateSchema = z.object({
    name: z.string().min(1),
    frontHtml: z.string().min(1),
    backHtml: z.string().min(1),
    css: z.string().optional(),
});

export type CreateCardTemplateInput = z.infer<typeof createCardTemplateSchema>;

export const updateCardTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    frontHtml: z.string().optional(),
    backHtml: z.string().optional(),
    css: z.string().optional(),
});

export type UpdateCardTemplateInput = z.infer<typeof updateCardTemplateSchema>;
