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
    text: z.string().min(1, "Văn bản không được để trống"),
    languageId: z.string().min(1, "Ngôn ngữ không được để trống"),
});

export type ExtractFromTextInput = z.infer<typeof extractFromTextSchema>;

export const extractFromTopicSchema = z.object({
    topic: z.string().min(1, "Chủ đề không được để trống"),
    languageId: z.string().min(1, "Ngôn ngữ không được để trống"),
    count: z.coerce.number().int().min(1, "Số lượng tối thiểu là 1").max(50, "Số lượng tối đa là 50").optional(),
});

export type ExtractFromTopicInput = z.infer<typeof extractFromTopicSchema>;

export const relatedNotesSchema = z.object({
    word: z.string().min(1, "Từ không được để trống"),
    languageId: z.string().min(1, "Ngôn ngữ không được để trống"),
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
