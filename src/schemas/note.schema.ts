import { PartOfSpeech } from "@/constants/type";
import { z } from "zod";

export const noteSchema = z.object({
    id: z.string().uuid(),
    deckId: z.string().uuid(),
    templateId: z.string().uuid(),
    languageId: z.string(),
    word: z.string(),
    meaning: z.string(),
    ipa: z.string().nullable().optional(),
    partOfSpeech: z.nativeEnum(PartOfSpeech).nullable().optional(),
    example: z.string().nullable().optional(),
    audioUrl: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    fields: z.record(z.string(), z.unknown()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;

export const noteParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
});

export type NoteParams = z.infer<typeof noteParamsSchema>;

export const previewNoteSchema = z.object({
    words: z.array(z.object({
        word: z.string().min(1, "Từ không được để trống"),
        detectedLanguage: z.string().optional(),
        userAudioUrl: z.string().optional(),
    })),
});

export type PreviewNoteInput = z.infer<typeof previewNoteSchema>;

export const confirmNoteSchema = z.object({
    deckId: z.string().uuid("Deck ID không hợp lệ"),
    words: z.array(z.object({
        word: z.string().min(1, "Từ không được để trống"),
        meaning: z.string().optional(),
        ipa: z.string().optional(),
        partOfSpeech: z.nativeEnum(PartOfSpeech).optional(),
        example: z.string().optional(),
        audioUrl: z.string().optional(),
        imageUrl: z.string().optional(),
        tags: z.array(z.string()).optional(),
    fields: z.record(z.string(), z.any()).optional(),
    })),
});

export type ConfirmNoteInput = z.infer<typeof confirmNoteSchema>;

export const updateNoteSchema = z.object({
    templateId: z.string().uuid().optional(),
    languageId: z.string().optional(),
    word: z.string().optional(),
    meaning: z.string().optional(),
    ipa: z.string().optional(),
    partOfSpeech: z.nativeEnum(PartOfSpeech).optional(),
    example: z.string().optional(),
    audioUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    tags: z.array(z.string()).optional(),
    fields: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

export const documentNoteSchema = z.object({
    deckId: z.string().uuid("Deck ID không hợp lệ"),
    languageId: z.string(),
    templateId: z.string().uuid("Template ID không hợp lệ"),
    fileName: z.string().optional(),
    items: z.array(z.object({
        word: z.string().min(1, "Từ không được để trống"),
        meaning: z.string().optional(),
        ipa: z.string().optional(),
        example: z.string().optional(),
        chunk: z.string().optional(),
        pageNumber: z.number().int().optional(),
        orderIndex: z.number().int(),
    })),
});

export type DocumentNoteInput = z.infer<typeof documentNoteSchema>;
