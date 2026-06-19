import { PartOfSpeech } from "@/constants/type";
import { z } from "zod";

export const aiNoteSchema = z.object({
    word: z.string(),
    meaning: z.string(),
    ipa: z.string(),
    example: z.string(),
    partOfSpeech: z.nativeEnum(PartOfSpeech),
    difficulty: z.number().int(),
});

export type AiNote = z.infer<typeof aiNoteSchema>;

export const extractFromTextSchema = z.object({
    text: z.string().min(1),
    languageId: z.string().min(1),
});

export type ExtractFromTextInput = z.infer<typeof extractFromTextSchema>;

export const extractFromTopicSchema = z.object({
    topic: z.string().min(1),
    languageId: z.string().min(1),
    count: z.coerce.number().int().min(1).max(50).optional(),
});

export type ExtractFromTopicInput = z.infer<typeof extractFromTopicSchema>;

export const relatedNotesSchema = z.object({
    word: z.string().min(1),
    languageId: z.string().min(1),
});

export type RelatedNotesInput = z.infer<typeof relatedNotesSchema>;

export interface RelatedNotesResponse {
    synonyms: AiNote[];
    antonyms: AiNote[];
}

export interface ProcessDocumentResponse {
    notes: AiNote[];
}

export interface DetectImageResponse {
    imageUrl: string;
    objects: Array<{
        label: string;
        confidence: number;
        bbox: [number, number, number, number];
    }>;
    notes: AiNote[];
}
