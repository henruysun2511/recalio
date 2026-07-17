import { CardState, ReviewRating } from "@/constants/type";
import { z } from "zod";

export const cardSchema = z.object({
    id: z.string().uuid(),
    noteId: z.string().uuid(),
    deckId: z.string().uuid(),
    cardTemplateId: z.string().uuid(),
    state: z.nativeEnum(CardState),
    due: z.string(),
    variantIndex: z.number().int().nullable().optional(),
    frontHtml: z.string(),
    backHtml: z.string(),
    css: z.string(),
    templateType: z.string().optional(),
    occlusion: z.object({
        imageUrl: z.string().nullable(),
        masks: z.array(z.object({
            x: z.number(), y: z.number(), width: z.number(), height: z.number(),
            groupIndex: z.number().int(),
            label: z.string().nullable().optional(),
        })),
    }).optional(),
    note: z.object({
        word: z.string().nullable().optional(),
        meaning: z.string().nullable().optional(),
        ipa: z.string().nullable().optional(),
        partOfSpeech: z.string().nullable().optional(),
        example: z.string().nullable().optional(),
        audioUrl: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        fields: z.record(z.string(), z.any()).nullable().optional(),
    }).optional(),
});

export type Card = z.infer<typeof cardSchema>;

export const cardParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    state: z.nativeEnum(CardState, { message: "Trạng thái thẻ không hợp lệ" }).optional(),
});

export type CardParams = z.infer<typeof cardParamsSchema>;

export const dueCardsParamsSchema = z.object({
    deckId: z.string().uuid().optional(),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    mode: z.enum(['normal', 'cram', 'preview']).optional().default('normal'),
});

export type DueCardsParams = z.input<typeof dueCardsParamsSchema>;

export const reviewCardSchema = z.object({
    rating: z.nativeEnum(ReviewRating, { message: "Đánh giá không hợp lệ" }),
    responseTimeMs: z.number().int().min(0, "Thời gian phản hồi không được âm"),
    sessionId: z.string().uuid("Session ID không hợp lệ").optional(),
});

export type ReviewCardInput = z.infer<typeof reviewCardSchema>;

export interface CardStats {
    new: number;
    learning: number;
    review: number;
    due: number;
    suspended: number;
    total: number;
}
